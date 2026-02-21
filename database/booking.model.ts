import mongoose, { Schema, Document, Model, Types } from 'mongoose';

/**
 * Interface representing the Booking document in MongoDB.
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema<IBooking>(
    {
      eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        index: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      },
    },
    { timestamps: true }
);

/**
 * Pre-save hook: validates that the referenced event exists in the database.
 */
// 1. REMOVED 'next' from the async function arguments
BookingSchema.pre<IBooking>('save', async function () {
  if (this.isModified('eventId')) {
    // 2. Safely check for the Event model. Do NOT use mongoose.model('Event') here
    // without a schema, or Next.js will crash with a MissingSchemaError.
    const EventModel = mongoose.models.Event;

    if (!EventModel) {
      throw new Error('Event model is not registered. Please import your Event model before saving a Booking.');
    }

    const eventExists = await EventModel.exists({ _id: this.eventId });

    if (!eventExists) {
      // 3. THROW the error instead of returning next()
      throw new Error('Referenced Event does not exist');
    }
  }
  // 4. REMOVED next() at the bottom. The async function resolving is enough.
});

/**
 * Export the model, ensuring no duplicate model compilation during Next.js HMR.
 */
const Booking: Model<IBooking> =
    mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;