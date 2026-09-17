import { Quote, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface MarketingTestimonial {
  id?: string;
  display_name: string;
  content: string;
  avatar_url?: string | null;
  role?: string | null;
  rating?: number | null;
}

interface TestimonialSectionProps {
  testimonials: MarketingTestimonial[];
  eyebrow?: string;
  title?: string;
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "NL"
  );
}

export async function TestimonialSection({
  testimonials,
  eyebrow = "Learner experiences",
  title = "Preparation feels more possible when you have the right support.",
}: TestimonialSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-background" aria-labelledby="testimonial-heading">
      <div className="mx-auto max-w-360 px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="max-w-[790px]">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.23em] text-accent">
            {eyebrow}
          </p>
          <h2
            id="testimonial-heading"
            className="text-[clamp(2.6rem,4.5vw,4.8rem)] font-semibold leading-[1.08] tracking-[-0.055em] text-foreground"
          >
            {title}
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {testimonials.map((testimonial, index) => {
            const rating = Math.max(0, Math.min(5, testimonial.rating ?? 0));

            return (
              <figure
                key={testimonial.id ?? `${testimonial.display_name}-${index}`}
                className="flex min-h-[300px] flex-col rounded-[1.75rem] border border-border bg-card p-7 sm:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <Quote
                    aria-hidden="true"
                    className="size-8 text-accent"
                    strokeWidth={1.5}
                  />
                  {rating > 0 && (
                    <span
                      className="flex gap-1"
                      aria-label={`${rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <Star
                          key={starIndex}
                          aria-hidden="true"
                          className={
                            starIndex < rating
                              ? "size-4 fill-accent text-accent"
                              : "size-4 text-border"
                          }
                        />
                      ))}
                    </span>
                  )}
                </div>
                <blockquote className="mt-8 flex-1 text-xl leading-relaxed text-foreground sm:text-2xl">
                  “{testimonial.content}”
                </blockquote>
                <figcaption className="mt-9 flex items-center gap-4 border-t border-border pt-6">
                  <Avatar className="size-12">
                    <AvatarImage
                      src={testimonial.avatar_url || undefined}
                      alt=""
                    />
                    <AvatarFallback className="bg-secondary text-sm font-semibold text-foreground shadow-none">
                      {getInitials(testimonial.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.display_name}
                    </p>
                    {testimonial.role && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    )}
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
