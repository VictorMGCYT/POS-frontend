import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Skeleton } from "./skeleton";



export function SkeletonForms() {

    return (
        <Dialog open={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <Skeleton className="h-6 w-40 mb-2" />
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-2 grid-cols-2">
                    {/* Labels */}
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                    {/* Inputs */}
                    <Skeleton className="h-8 w-full rounded" />
                    <Skeleton className="h-8 w-full rounded" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-full rounded" />
                    <Skeleton className="h-8 w-full rounded" />
                    <Skeleton className="h-4 w-32 col-span-2" />
                    <Skeleton className="h-8 w-full col-span-2 rounded" />
                    {/* Botón */}
                    <Skeleton className="h-10 w-full col-span-2 rounded mt-4" />
                </div>
            </DialogContent>
        </Dialog>
    )

}