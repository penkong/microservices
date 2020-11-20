import { Subjects } from './subjects'
import { OrderStatusEnum } from '.'

export interface IOrderCreatedEvent {
  subject: Subjects.OrderCreated
  data: {
    id: string
    statsu: OrderStatusEnum
    userId: string
    expiresAt: string
    ticket: {
      id: string
      price: number
    }
  }
}