import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing the Event document in MongoDB.
 */
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, index: true },
        description: { type: String, required: true, trim: true },
        overview: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true },
        venue: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        date: { type: String, required: true, trim: true },
        time: { type: String, required: true, trim: true },
        mode: { type: String, required: true, trim: true },
        audience: { type: String, required: true, trim: true },
        agenda: {
            type: [String],
            required: true,
            validate: [(v: string[]) => v.length > 0, 'Agenda cannot be empty']
        },
        organizer: { type: String, required: true, trim: true },
        tags: {
            type: [String],
            required: true,
            validate: [(v: string[]) => v.length > 0, 'Tags cannot be empty']
        },
    },
    { timestamps: true }
);

/**
 * Pre-validate hook: slug generation, date normalization, and basic validation.
 */
EventSchema.pre<IEvent>('validate', function () {
    // Slug generation if title is modified or slug is missing
    if (this.isModified('title') || !this.slug) {
        if (this.title) {
            this.slug = this.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric except spaces/hyphens
                .replace(/[\s_]+/g, '-')   // Replace spaces/underscores with hyphens
                .replace(/-+/g, '-')       // Replace multiple hyphens with one
                .replace(/^-+|-+$/g, '');  // Trim hyphens from ends
        }
    }

    // Date normalization and validation
    if (this.isModified('date') && this.date) {
        const parsedDate = new Date(this.date);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date format provided');
        }
        this.date = parsedDate.toISOString();
    }

    // Consistent time format (trimming)
    if (this.isModified('time') && this.time) {
        this.time = this.time.trim();
    }
});

/**
 * Export the model, ensuring no duplicate model compilation during Next.js HMR.
 */
const Event: Model<IEvent> =
    mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;