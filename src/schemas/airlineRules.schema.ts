import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type airlineRulesDocument = airlineRules & Document;

@Schema()
export class airlineRules {
  @Prop()
  fName: string;

  @Prop(
    raw({
      from: { type: String },
      to: { type: String },
    }),
  )
  bookingAllowed: Record<string, any>;

  @Prop(
    raw({
      from: { type: String },
      to: { type: String },
    }),
  )
  travelAllowed: Record<string, any>;

  @Prop({ default: null })
  originCountry: string;

  @Prop({ default: null })
  destinationCountry: string;

  @Prop({ default: null })
  originAirportCode: string;

  @Prop({ default: null })
  destinationAirportCode: string;

  @Prop({ default: null })
  weekdays: string;

  @Prop({ default: null })
  userNotAffected: string;

  @Prop(
    raw([
      {
        classId: { type: String },
        commission: { type: String },
        serviceCharge: { type: String },
        type: { type: String },
      },
    ]),
  )
  classes: Record<string, any>;

  @Prop(
    raw({
      id: { type: String },
      name: { type: String },
    }),
  )
  createdBy: Record<string, any>;

  @Prop()
  createdAt: number;

  @Prop()
  isActive: boolean;
}

export const airlineRuleSchema = SchemaFactory.createForClass(airlineRules);
