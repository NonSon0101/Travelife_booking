import PageLayout from "components/Layout/WebLayout/PageLayout";
import CartPage from "pages/CartPage";

const CartPageLayout = () => {
  return (
    <PageLayout title={"Cart"}>
      <CartPage />;
    </PageLayout>
  )
};

export default CartPageLayout;
