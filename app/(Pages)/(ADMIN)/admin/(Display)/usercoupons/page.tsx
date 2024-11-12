"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "@/app/api/axios/axios";
import { Check, X } from "lucide-react";
import { format } from "date-fns";

interface UnverifiedCoupon {
  id: number;
  title: string;
  coupon_code: string | null;
  type: "Coupon" | "Deal";
  store: { name: string };
  category: { name: string };
  ref_link: string;
  due_date: string;
  description: string | null;
}

export default function UserCoupons() {
  const [coupons, setCoupons] = useState<UnverifiedCoupon[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    type: "verify" | "delete";
    id: number;
  } | null>(null);

  const fetchUnverifiedCoupons = async () => {
    const response = await axios.get("/getusersubmittedcoupons");
    if (response?.data?.success) {
      setCoupons(response?.data?.unverifiedCoupons);
    }
  };

  useEffect(() => {
    fetchUnverifiedCoupons();
  }, []);

  const handleVerify = async (id: number) => {
    const response = await axios.post(`/verifyusersubmittedcoupons/${id}`);
    if (response?.data?.success) {
      setCoupons((prevCoupons) =>
        prevCoupons.filter((coupon) => coupon.id !== id),
      );
    }
  };

  const handleDelete = async (id: number) => {
    const response = await axios.delete(`/deleteusersubmittedcoupon/${id}`);
    if (response?.data?.success) {
      setCoupons((prevCoupons) =>
        prevCoupons.filter((coupon) => coupon.id !== id),
      );
    }
  };

  const handleAction = () => {
    if (currentAction) {
      if (currentAction.type === "verify") {
        handleVerify(currentAction.id);
      } else {
        handleDelete(currentAction.id);
      }
    }
    setIsDialogOpen(false);
    setCurrentAction(null);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-4 text-2xl font-bold">Unverified Coupons</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>{coupon.title}</TableCell>
              <TableCell>{coupon.coupon_code || "N/A"}</TableCell>
              <TableCell>{coupon.type}</TableCell>
              <TableCell>{coupon.store.name}</TableCell>
              <TableCell>{coupon.category.name}</TableCell>
              <TableCell>
                {format(new Date(coupon.due_date), "dd-MMM-yyyy")}
              </TableCell>
              <TableCell className="flex items-center gap-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Check
                        onClick={() => {
                          setCurrentAction({ type: "verify", id: coupon.id });
                          setIsDialogOpen(true);
                        }}
                        className="mr-2 size-6 cursor-pointer text-emerald-500"
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-muted-foreground">
                      <p>Verify</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <X
                        onClick={() => {
                          setCurrentAction({ type: "delete", id: coupon.id });
                          setIsDialogOpen(true);
                        }}
                        className="size-6 cursor-pointer text-app-main"
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-muted-foreground">
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-11/12 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {currentAction?.type} this coupon?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-x-2 gap-y-4 lg:flex-row">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
