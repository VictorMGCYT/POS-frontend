import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface DialogDeleteProductProps {
    refDeleteProduct:  React.RefObject<HTMLButtonElement | null>;
    hanldeDeleteSubmit: () => Promise<void>;
    loading: boolean;
}

export default function DialogDeleteProduct({
        refDeleteProduct,
        hanldeDeleteSubmit,
        loading
    }: DialogDeleteProductProps) {

    return (
        <AlertDialog>
            <AlertDialogTrigger 
                ref={refDeleteProduct}
                className="hidden">
                Abrir
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>¿Seguro que deseas eliminar este producto?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta acción no puede ser invertida.
                    El producto será eliminado permanentemente.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction disabled={loading} onClick={hanldeDeleteSubmit}>
                    {loading ? 'Eliminando...' : 'Continuar'}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}