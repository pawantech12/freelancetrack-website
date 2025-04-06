import { Badge } from "@/components/ui/badge";

export function RecentProjects({ recentProjects }) {
  return (
    <div className="space-y-4">
      {recentProjects.length > 0 ? (
        recentProjects.map((project, index) => {
          return (
            <div className="flex items-center justify-between" key={index}>
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Client: {project.clientName}
                </p>
              </div>
              <Badge>{project.status}</Badge>
            </div>
          );
        })
      ) : (
        <p>No Projects Found</p>
      )}
    </div>
  );
}
