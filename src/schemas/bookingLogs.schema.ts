import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as s } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

export type BookingsDocument = Bookings & Document;

@Schema()
export class Bookings {
  @Prop({ type: s.Types.ObjectId, ref: 'users', default: null })
  userId: string;

  @Prop()
  bookingNumber: string;

  @Prop()
  amountPaid: number;

  @Prop(
    raw({
      total: { type: String },
      base: { type: String },
    }),
  )
  amadeusPricing: Record<string, any>;

  @Prop(
    raw({
      bookingId: { type: String },
      associatedRecords: {
        type: [
          {
            reference: { type: String },
            creationDate: { type: String },
            originSystemCode: { type: String },
            flightOfferId: { type: String },
          },
        ],
      },
    }),
  )
  amadeusResponse: Record<string, any>;

  @Prop({ default: null })
  userMethodofPayment: string;

  @Prop()
  currency: string;

  @Prop({ default: null })
  transactionId: string;

  @Prop()
  isInstant: boolean;

  // @Prop({ type: String, default: function genUUID(){
  //   return uuidV4()
  // }})
  // flightId: string;

  @Prop(raw({}))
  customerDetail: Record<string, any>;

  @Prop(raw({}))
  paymentDetail: Record<string, any>;

  @Prop(raw({}))
  flightDetail: Record<string, any>;

  @Prop({ default: 'IN_PROGRESS' })
  status: 'IN_PROGRESS' | 'SUCCESS' | 'CANCELLED' | 'FAILED';

  @Prop()
  reason?: string;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Bookings);
