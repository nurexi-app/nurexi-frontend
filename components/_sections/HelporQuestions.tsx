import { Button } from "@/components/ui/button";

export default function HelporQuestions() {
  return (
    <section className="bg-secondaryDarkActive h-60 py-12 pb-15 text-center flex items-center flex-col  text-white  ">
      <div className="gap-2 flex items-center flex-col  max-w-200 ">
        <h5 className="text-2xl">Need help or any additional questions?</h5>
        <p className="bodyText mb-4">
          Reach out directly! We&apos;re here to help you every step of the way.
        </p>

        <Button>Get in touch</Button>
      </div>
    </section>
  );
}
