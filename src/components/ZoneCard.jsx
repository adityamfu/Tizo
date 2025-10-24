import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { nowInZone } from "@/utils/timeUtils";

export default function ZoneCard({ zone }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{zone}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between text-sm text-muted-foreground">
        <span>Current Time</span>
        <span className="font-mono">{nowInZone(zone)}</span>
      </CardContent>
    </Card>
  );
}
