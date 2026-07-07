"use client";
import { Button } from "@/components/ui/button";
import { Item, ItemContent } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import {
  calcDiscountedPrice,
  formatPrice,
  isReadyToPublish,
} from "@/lib/utils";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tag, Info, TrendingDown, Percent, Trash, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { publishCourse, updateCourseData } from "@/lib/actions/course-action";
import { toast } from "sonner";
import {
  MIN_PRICE,
  PLATFORM_FEE_RATE,
  pricingSchema,
  PricingFormValues,
} from "@/lib/validators/courseUpload";
import { useCourse } from "@/context/CourseProvider";

// ─── sub-components ───────────────────────────────────────────────────────────

function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function RevenueRow({
  label,
  value,
  variant = "default",
  strikethrough,
}: {
  label: string;
  value: string;
  variant?: "default" | "muted" | "primary" | "destructive";
  strikethrough?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <p
        className={cn(
          "text-sm font-medium",
          variant === "muted" && "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          variant === "muted" && "text-muted-foreground",
          variant === "primary" && "text-primary text-base",
          variant === "destructive" && "text-destructive",
          strikethrough && "line-through text-muted-foreground font-normal",
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

interface CoursePricingProps {
  courseData: any;
}

const CoursePricing = ({ courseData }: CoursePricingProps) => {
  const { sections } = useCourse();

  const defaultValuesFromCourse = {
    price: courseData.price,
    isFree: courseData.is_free,
    discountType: courseData.discount_type,
    discountValue: courseData.discount_value,
    discountExpiry: new Date(courseData.discount_expiry)
      .toISOString()
      .split("T")[0],
    hasDiscount: courseData.has_discount,
  };

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema) as any,
    defaultValues: {
      ...defaultValuesFromCourse,
    },
  });

  const isFree = useWatch({ control: form.control, name: "isFree" });
  const price = useWatch({ control: form.control, name: "price" }) ?? 0;
  const hasDiscount = useWatch({ control: form.control, name: "hasDiscount" });
  const discountType = useWatch({
    control: form.control,
    name: "discountType",
  });
  const discountValue =
    useWatch({ control: form.control, name: "discountValue" }) ?? 0;

  const effectivePrice =
    !isFree && hasDiscount && discountValue > 0
      ? calcDiscountedPrice(price, discountType, discountValue)
      : price;

  const platformFee = isFree ? 0 : price * PLATFORM_FEE_RATE;
  const yourRevenue = isFree ? 0 : effectivePrice - platformFee;
  const hasValidDiscount =
    !isFree && hasDiscount && discountValue > 0 && effectivePrice < price;

  const [isPending, startTransition] = useTransition();
  const onsubmit = (data: PricingFormValues) => {
    startTransition(async () => {
      const payload = {
        is_free: data.isFree,
        price: isFree ? 0 : data.price,
        has_discount: isFree ? false : data.hasDiscount,
        discount_type: isFree ? null : data.discountType,
        discount_value: isFree ? null : data.discountValue,
        discount_expiry: isFree ? null : data.discountExpiry,
      };
      try {
        const response = await updateCourseData(courseData.id, payload);

        if (response.success) {
          toast.success("Course pricing updated successfully");
        } else {
          toast.error("something went wrong");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message || "something went wrong");
        }
      }
    });
  };

  // Check if course is ready to publish
  const [isPublishing, startPublishing] = useTransition();
  const validation = isReadyToPublish({ ...courseData, sections });

  const handlePublish = () => {
    if (!validation.ready) {
      toast.error(validation.message);
      return;
    }

    startPublishing(async () => {
      try {
        const result = await publishCourse(courseData.id);
        if (result.success) {
          toast.success("Course published successfully!");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to publish",
        );
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
      <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-muted/20">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">Free course</p>
          <p className="text-[12px] text-muted-foreground leading-snug">
            Enrolment is free for everyone. You won't earn revenue but it builds
            your audience.
          </p>
        </div>
        <Controller
          name="isFree"
          control={form.control}
          render={({ field }) => (
            <Switch
              className="cursor-pointer shrink-0 mt-0.5"
              id="isFree"
              checked={!!field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (checked) {
                  form.setValue("hasDiscount", false);
                  form.setValue("discountValue", undefined);
                }
              }}
            />
          )}
        />
      </div>

      {/* ── paid fields (conditionally rendered) ── */}
      {!isFree && (
        <div className="space-y-5">
          {/* price */}
          <div className="space-y-4">
            <SectionLabel icon={Tag} label="Course price" />
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Price{" "}
                    <span className="text-muted-foreground font-normal">
                      (NGN)
                    </span>
                  </FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none">
                      ₦
                    </span>
                    <Input
                      type="number"
                      min={MIN_PRICE}
                      step={100}
                      placeholder="e.g. 15000"
                      className="pl-8 h-9.5 rounded-lg bg-primary-light"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <FieldError errors={[fieldState.error]} />
                  <p className="text-[11px] text-muted-foreground">
                    Minimum price: {formatPrice(MIN_PRICE)}
                  </p>
                </Field>
              )}
            />
          </div>

          <Separator />

          {/* promotional discount */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionLabel icon={Percent} label="Promotional discount" />
              <Controller
                name="hasDiscount"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    className="cursor-pointer"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {hasDiscount && (
              <div className="space-y-4 rounded-xl border border-dashed border-border p-4 bg-muted/10">
                {/* discount type selector */}
                <Controller
                  name="discountType"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Discount type</FieldLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {(["percentage", "fixed"] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => field.onChange(type)}
                            className={cn(
                              "flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-all",
                              field.value === type
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                            )}
                          >
                            {type === "percentage" ? (
                              <>
                                <Percent className="h-3.5 w-3.5" />
                                Percentage
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-3.5 w-3.5" />
                                Fixed amount
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </Field>
                  )}
                />

                {/* discount value */}
                <Controller
                  name="discountValue"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        {discountType === "percentage"
                          ? "Discount percentage"
                          : "Discount amount (NGN)"}
                      </FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none">
                          {discountType === "percentage" ? "%" : "₦"}
                        </span>
                        <Input
                          type="number"
                          min={1}
                          max={discountType === "percentage" ? 90 : price * 0.5}
                          {...(discountType === "percentage" && {
                            step: 1,
                          })}
                          placeholder={
                            discountType === "percentage"
                              ? "e.g. 20"
                              : "e.g. 2000"
                          }
                          className="pl-8 h-9.5 rounded-lg bg-primary-light"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                            )
                          }
                        />
                      </div>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />

                {/* expiry date */}
                <Controller
                  name="discountExpiry"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          Expiry date{" "}
                          <span className="text-muted-foreground font-normal">
                            (optional)
                          </span>
                        </FieldLabel>
                        <Input
                          type="date"
                          className="h-9.5 rounded-lg bg-primary-light"
                          min={new Date().toISOString().split("T")[0]}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />

                        {field.value ? (
                          <p className="text-[11px] text-muted-foreground">
                            Discount reverts to full price after this date.
                          </p>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">
                            Let the discount run its course. You can always
                            change it later.
                          </p>
                        )}

                        {field.value && (
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => field.onChange("")}
                            >
                              <Trash />
                              <span> Remove expiry date</span>
                            </Button>
                          </div>
                        )}
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    );
                  }}
                />

                {/* live discount preview */}
                {hasValidDiscount && (
                  <div className="flex items-center gap-2 text-[12px]">
                    <Badge
                      variant="destructive"
                      className="text-[11px] font-bold"
                    >
                      {discountType === "percentage"
                        ? `-${discountValue}%`
                        : `-${formatPrice(discountValue)}`}
                    </Badge>
                    <span className="text-muted-foreground">
                      Learners pay{" "}
                      <span className="font-semibold text-foreground">
                        {formatPrice(effectivePrice)}
                      </span>{" "}
                      instead of {formatPrice(price)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── revenue breakdown ── */}
      <Item
        className={cn(
          "rounded-xl border transition-all",
          isFree
            ? "border-border bg-muted/20"
            : "border-secondary bg-secondaryLight hover:bg-secondaryLight/80 cursor-pointer",
        )}
      >
        <ItemContent>
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="font-semibold leading-[130%]">Revenue breakdown</h4>
            {isFree && (
              <Badge variant="secondary" className="text-[10px]">
                Free course
              </Badge>
            )}
          </div>

          {isFree ? (
            <div className="flex items-start gap-2 text-[12px] text-muted-foreground py-1">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <p>
                Free courses don't generate revenue. You can monetise through
                paid bundles or upgrades later.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {hasValidDiscount ? (
                <>
                  <RevenueRow
                    label="Original price"
                    value={formatPrice(price)}
                    strikethrough
                  />
                  <RevenueRow
                    label={
                      discountType === "percentage"
                        ? `Discount (${discountValue}%)`
                        : "Discount (fixed)"
                    }
                    value={`- ${formatPrice(price - effectivePrice)}`}
                    variant="destructive"
                  />
                  <RevenueRow
                    label="Learner pays"
                    value={formatPrice(effectivePrice)}
                  />
                </>
              ) : (
                <RevenueRow
                  label="Course price"
                  value={price > 0 ? formatPrice(price) : "—"}
                />
              )}

              <RevenueRow
                label={`Platform fee (${(PLATFORM_FEE_RATE * 100).toFixed(0)}%)`}
                value={price > 0 ? `- ${formatPrice(platformFee)}` : "—"}
                variant="muted"
              />

              <Separator className="my-2" />

              <RevenueRow
                label="Your revenue"
                value={price > 0 ? formatPrice(yourRevenue) : "—"}
                variant="primary"
              />
            </div>
          )}
        </ItemContent>
      </Item>

      <Separator />

      <div className="flex items-center justify-between">
        <p className="text-[12px] text-muted-foreground">
          Platform fee is deducted automatically on each sale.
        </p>
        <div className="flex items-center gap-2">
          {isPending ? (
            <Button disabled={isPending} variant="outline" className="">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              variant="outline"
              className=""
            >
              Save pricing
            </Button>
          )}

          <Button
            type="button"
            onClick={() => handlePublish()}
            variant="secondary"
            className="text-white"
            disabled={
              isPublishing || isPending || courseData.status === "published"
            }
          >
            {isPublishing
              ? "Publishing..."
              : courseData.status === "published"
                ? "Published"
                : "Publish Course"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CoursePricing;
