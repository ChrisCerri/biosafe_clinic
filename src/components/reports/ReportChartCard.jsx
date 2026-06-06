import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function ReportChartCard({ title, description, children, className }) {
  return (
    <Card className={cn("gap-0 border-border bg-white py-0 shadow-sm", className)}>
      <CardHeader className="border-b px-5 pb-4 pt-5">
        <CardTitle className="text-base font-bold text-foreground">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm font-medium text-slate-600">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-3 pb-4 pt-4 sm:px-5">{children}</CardContent>
    </Card>
  )
}
