const StorePage = ({ params }: { params: { storename: string } }) => {
  return <div>{params.storename}</div>;
};

export default StorePage;
