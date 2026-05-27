import ExamPersistGate from "@/context/PersistGate";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <ExamPersistGate>{children}</ExamPersistGate>;
};

export default layout;
