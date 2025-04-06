import { Star } from "lucide-react";

export function RecentTestimonials({ recentTestimonials }) {
  return (
    <div className="space-y-6">
      {recentTestimonials.map((testimonial, index) => {
        return (
          <div className="space-y-2" key={index}>
            <div className="flex items-center">
              <div className="font-medium">{testimonial.clientName}</div>
              <div className="ml-auto flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              "{testimonial.review}"
            </p>
            <div className="text-xs text-muted-foreground">
              Project: {testimonial.projectName} •{" "}
              {new Date(testimonial.date).toLocaleDateString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
