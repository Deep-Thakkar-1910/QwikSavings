import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import axios from "@/app/api/axios/axios";
import { usePathname, useRouter } from "next/navigation";

interface StarRatingProps {
  storeId: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ storeId }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const { data: session } = useSession();
  const router = useRouter();
  const currentUrl = usePathname();
  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const response = await axios.get(
          `/getuserrating?userId=${session?.user?.id}&storeId=${storeId}`,
        );
        if (response.data.success) {
          setRating(response.data.rating);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    const fetchStoreRatings = async () => {
      try {
        const response = await axios.get(`/getstorerating?storeId=${storeId}`);

        if (response.data.success) {
          setAverageRating(response.data.average_rating);
          setTotalRatings(response.data.ratings_count);
        }
      } catch (error) {
        console.error("Error fetching store ratings:", error);
      }
    };

    if (session?.user) {
      fetchUserRating();
    }
    if (storeId) fetchStoreRatings();
  }, [session, storeId]);

  const handleStarClick = (value: number) => {
    if (rating === null) {
      setSelectedRating(value);
      setIsDialogOpen(true);
    }
  };

  const handleConfirmRating = async () => {
    setIsDialogOpen(false);
    if (!session?.user) {
      toast({
        title: "Uh Oh!",
        description: "You must be logged in to rate a store",
        variant: "destructive",
      });
      router.push(`/signin?callbackUrl=${currentUrl}`);
      return;
    }

    // Optimistically update the UI
    setRating(selectedRating);
    setTotalRatings(totalRatings + 1);
    setAverageRating(
      (averageRating * totalRatings + selectedRating) / (totalRatings + 1),
    );
    try {
      const response = await axios.post("/updaterating", {
        body: JSON.stringify({
          storeId,
          rating: selectedRating,
          userId: session.user.id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.data.success) {
        throw new Error("Failed to update rating");
      }

      toast({
        title: "Success!",
        description: "Rating updated successfully!",
      });
    } catch (error) {
      console.error("Error updating rating:", error);
      toast({
        title: "Uh Oh!",
        description: "Failed to update rating. Please try again.",
        variant: "destructive",
      });
      setRating(null);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <span className="mr-2 font-semibold lg:hidden">Your Rating:</span>
      <div className="flex items-center">
        <span className="mr-2 hidden font-semibold lg:block">Your Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`cursor-pointer transition-colors ${
              (hoverRating || rating || 0) >= star
                ? "text-amber-400"
                : "text-gray-300"
            }`}
            fill={
              (hoverRating || rating || 0) >= star ? "currentColor" : "none"
            }
            onMouseEnter={() => rating === null && setHoverRating(star)}
            onMouseLeave={() => rating === null && setHoverRating(0)}
            onClick={() => handleStarClick(star)}
          />
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-11/12 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Rating</DialogTitle>
            <DialogDescription>
              Are you sure you want to rate this store {selectedRating} stars?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-x-2 gap-y-4 lg:flex-row">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRating}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mt-2 text-sm text-muted-foreground">
        <span className="font-semibold">{averageRating.toFixed(1)} / 5</span>
        <span className="ml-2">
          ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
        </span>
      </div>
    </div>
  );
};
