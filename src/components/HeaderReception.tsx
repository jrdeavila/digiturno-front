import imagen from "@/assets/img/logoBlanco.png";
export default function HeaderReception() {
  return (
    <div className="encabezadoReceptor">
      <img src={imagen} alt="Logo Blanco Cámara de Comercio" width={200} />
      <h1 className="titulo">Módulo Receptor Digiturno V2.0</h1>
    </div>
  );
}
