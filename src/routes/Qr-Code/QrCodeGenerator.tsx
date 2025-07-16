import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, Download, MessageSquareWarningIcon, QrCode} from "lucide-react";
import { useRef, useState } from "react";
import {QRCodeSVG} from 'qrcode.react';
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";



export default function QrCodeGenrator() {
    const [qrCode, setQrCode] = useState("");
    const svgRef = useRef<SVGSVGElement>(null)

    function handleCopyQr(){
        if (qrCode) {
            navigator.clipboard.writeText(qrCode);
            toast.success("Se ha copiado el UUID al portapapeles");
        } else{
            toast.error("No se ha generado ningún código")
        }
    }

    function handleDownloadQr() {
        if(!svgRef.current) return;
        let svg = svgRef.current.outerHTML;
        if (!svg.includes('xmlns')) {
            svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        const blobSvg = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blobSvg);

        const img = new window.Image();
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if(!ctx) return;
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            canvas.toBlob(function (blob) {
                const link = document.createElement("a");
                if(!blob) return;
                link.href = URL.createObjectURL(blob);
                link.download = "qr-code.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, "image/png");
        };
        img.src = url;
    }

    return(
        <>
            <div className="grid items-center p-4 grid-cols-1 md:grid-cols-[2fr_1fr] gap-4  w-full">
                <div>
                    <h2 className="text-2xl font-bold">Generador de códigos QR</h2>
                    <p className="text-gray-500">Genera códigos QR personalizados para tus productos.</p>
                </div>
                
            </div>
            <div className="grid p-4 grid-cols-1 md:grid-cols-2 gap-4  w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Generar código QR
                        </CardTitle>
                        <CardAction>
                            <QrCode/>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Label htmlFor="qr-code-input">Escribe tu código personalizado:</Label>
                        <div className="flex gap-2">
                            <Input
                                id="qr-code-input"
                                placeholder="Código QR a generar"
                                value={qrCode}
                                onChange={e => {
                                    const value = e.target.value.replace(/[^a-z0-9_]/g, "");
                                    setQrCode(value);
                                }}
                                />
                            <Button 
                                onClick={handleCopyQr}
                                className="hover:cursor-pointer">
                                <Copy/>
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Alert variant="default" className="text-amber-500 border border-amber-500">
                            <MessageSquareWarningIcon/>
                            <AlertTitle>Advertencia:</AlertTitle>
                            <AlertDescription>
                                Los códigos solo se pueden generar usando minúsculas, números y guiones bajos.
                            </AlertDescription>
                        </Alert>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Vista previa
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center">
                        {
                            qrCode === "" ?
                            <div
                                className="w-[200px] h-[200px] border border-gray-500
                                rounded-2xl bg-white">
                            </div>
                            :
                            <div className="flex flex-col gap-2">
                                <QRCodeSVG 
                                    ref={svgRef}
                                    className="w-[200px] h-[200px] border border-gray-500
                                    rounded-2xl bg-white p-2"
                                    width={512}
                                    height={512}
                                    value={qrCode}/>
                                <Button
                                    onClick={handleDownloadQr}
                                    className="bg-blue-600 hover:bg-blue-800
                                    hover:cursor-pointer dark:text-white">
                                    <Download/> Descargar imagen
                                </Button>
                            </div>
                                
                        }
                    </CardContent>
                </Card>
            </div>
        </>
    )
}