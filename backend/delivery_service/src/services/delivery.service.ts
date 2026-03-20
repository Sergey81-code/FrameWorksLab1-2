import * as DeliveryRepository from "../repositories/delivery.repository";
import { CreateDeliveryDto, UpdateDeliveryDto, DeliveryResponse } from "@lab1_2/types";
import { 
  DeliveryNotFoundError, 
  DeliveryCreateFailed, 
  DeliveryUpdateFailed, 
  DeliveryDeleteFailed 
} from "../errors/delivery.errors";

const toDeliveryResponse = (d: any): DeliveryResponse => ({
  id: d.id,
  order_id: d.order_id,
  address: d.address,
  status: d.status,
  delivery_date: d.delivery_date ? d.delivery_date.toISOString() : null,
  created_at: d.created_at.toISOString(),
});

export const getDeliveries = async () => {
  const deliveries = await DeliveryRepository.findAll();
  return deliveries.map(toDeliveryResponse);
};

export const getDelivery = async (id: string) => {
  const delivery = await DeliveryRepository.findById(id);
  if (!delivery) throw new DeliveryNotFoundError();
  return toDeliveryResponse(delivery);
};

export const createDelivery = async (data: CreateDeliveryDto) => {
  const delivery = await DeliveryRepository.createDelivery(data);
  if (!delivery) throw new DeliveryCreateFailed();
  return toDeliveryResponse(delivery);
};

export const updateDelivery = async (id: string, data: UpdateDeliveryDto) => {
  const delivery = await DeliveryRepository.findById(id);
  if (!delivery) throw new DeliveryNotFoundError();

  const updated = await DeliveryRepository.updateDelivery(id, data);
  if (!updated) throw new DeliveryUpdateFailed();
  return toDeliveryResponse(updated);
};

export const deleteDelivery = async (id: string) => {
  const delivery = await DeliveryRepository.findById(id);
  if (!delivery) throw new DeliveryNotFoundError();

  const deleted = await DeliveryRepository.deleteDelivery(id);
  if (!deleted) throw new DeliveryDeleteFailed();
  return deleted;
};