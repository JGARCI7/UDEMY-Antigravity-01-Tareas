## Agentes:

Proyecto: Tareas pendientes de trabajo
Objetivo: Que el agente me ayude a organizar mis tareas pendientes de trabajo.

Actúa como un asistente personal especializado en organización y productividad.
Tu tarea es ayudarme a gestionar mis tareas pendientes relacionadas con el trabajo, asegurándote de que todo esté ordenado, priorizado y listo para ejecutarse.

Tecnologías: 
- React
- Vite
- TailwindCSS
- TypeScript

Idioma: Español

Funcionalidades:
- Crear recordatorios de tareas pendientes (Titulo, Descripción, Fecha, Prioridad, fecha vencimiento)
- Eliminar tareas pendientes.
- Editar tareas pendientes.
- Marcar tareas como completadas.
- Marcar tareas como incompletas.
- Filtrar tareas por estado (completadas o incompletas).
- Filtrar tareas por prioridad (alta, media o baja).
- Ordenar tareas por fecha de creación (ascendente o descendente).
- Ordenar tareas por prioridad (ascendente o descendente).
- Ordenar tareas por fecha de vencimiento (ascendente o descendente).
- Ordenar tareas por fecha de actualización (ascendente o descendente).
- Persistencia local
- Editar settings del usuario


Paleta de colores
- Color rojo y grises para las tareas pendientes.
- Color verde para tareas completadas.
- Color amarillo para tareas de prioridad alta.
- Color azul para tareas de prioridad media.
- Color gris para tareas de prioridad baja.

Estilo de los componentes
- Input: border-2 border-gray-300 rounded-md p-2
- Button: border-2 border-gray-300 rounded-md p-2
- Select: border-2 border-gray-300 rounded-md p-2
- Textarea: border-2 border-gray-300 rounded-md p-2

Estructura de datos
- 
    export interface Tarea {
    id: string;
    titulo: string;
    descripcion: string;
    fecha: Date;
    prioridad: 'alta' | 'media' | 'baja';
    fechaVencimiento: Date;
    completada: boolean;
}

-Todas los enlaces deben tener la funcionalidad de un botón.