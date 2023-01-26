import {
  Address as InkSoftAddress,
  Order as InkSoftOrder,
} from 'inksoft';
import {
  Address as PrintfulAddress,
  Order as PrintfulOrder,
  CreateOrder as CreatePrintfulOrder,
  SyncVariant,
  CreateOrder,
} from 'printful';

export const shouldCreateNewPrinfulOrder = (
  inksoftOrder: InkSoftOrder,
  existingOrder: PrintfulOrder | null,
) => isInkSoftOrderInFulfillableState(inksoftOrder) && doesExistingOrderExist(existingOrder);

const isInkSoftOrderInFulfillableState = (order: InkSoftOrder) => order.Authorized
  && order.Paid
  && (!order.ApprovalRequired || order.ApprovalDate !== null)
  && !order.Ordered
  && !order.Received
  && !order.Shipped
  && !order.Cancelled;

const doesExistingOrderExist = (order: PrintfulOrder | null) => order !== null;

export const getPrintfulVariantExternalId = (
  item: InkSoftOrder.Item,
) => item.OrderRetailItemSizeId.toString();

export const makeCreatePrintfulOrder = (
  order: InkSoftOrder,
  printfulVariants: Record<string, SyncVariant>,
): CreatePrintfulOrder => {
  const {
    UniqueId,
    Email,
    ShippingAddress,
    Items,
  } = order;
  const items = Items.map((item) => {
    const externalId = getPrintfulVariantExternalId(item);
    return makeCreatePrintfulOrderItem(item, printfulVariants[externalId]);
  });
  return {
    external_id: UniqueId,
    recipient: transformAddress(ShippingAddress, Email),
    items,
  };
};

export const makeCreatePrintfulOrderItem = (
  item: InkSoftOrder.Item,
  printfulVariant: SyncVariant | undefined,
): CreateOrder.Item => {
  if (!printfulVariant) {
    throw new Error(`Missing Printful variant to create order item: ${item.OrderRetailItemSizeId}`);
  }
  const {
    Quantity,
    ItemTotal,
    FullName,
  } = item;
  const {
    id,
    product,
    sku,
  } = printfulVariant;
  return {
    sync_variant_id: id,
    quantity: Quantity,
    retail_price: ItemTotal.toString(),
    product,
    name: FullName,
    sku,
  };
};

export const transformAddress = (address: InkSoftAddress, email: string): PrintfulAddress => {
  const {
    Name,
    CompanyName,
    Street1,
    Street2,
    City,
    State,
    StateName,
    CountryCode,
    Country,
    PostCode,
    Phone,
    TaxId,
  } = address;
  return {
    name: Name,
    company: CompanyName,
    address1: Street1,
    address2: Street2,
    city: City,
    state_code: State,
    state_name: StateName,
    country_code: CountryCode,
    country_name: Country,
    zip: PostCode,
    phone: Phone,
    email,
    tax_number: TaxId,
  };
};
