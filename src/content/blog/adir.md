---
title: 'Cómo hice que un coche autónomo tomara decisiones en cruces y rotondas'
description: 'Post sobre mi Trabajo Fin de Grado'
pubDate: 'Sep 01 2020'
heroImage: '../../assets/blog-placeholder-3.jpg'
pinned: true
---

Durante mis dos últimos años en la universidad participé en el [Autonomous Driving Challenge](https://carnetbarcelona.com/autonomous-driving-challenge/), una competición interuniversitaria organizada por la UPC, CARNET y SEAT. En ella, varios equipos de estudiantes desarrollamos sistemas de conducción autónoma para un coche eléctrico a escala 1:10, enfrentándonos a un circuito urbano con rectas, curvas, intersecciones y rotondas.

Mi proyecto se centró en un reto muy concreto: **permitir que vehículo autónomo supiera cómo actuar al llegar a una intersección**. Aunque los organizadores nos proporcionaban un módulo base para seguir líneas pintadas en el suelo, este sistema no permitía que el coche tomara decisiones en cruces o rotondas.

> 📷 [Aquí incluir una foto del coche o del entorno del circuito a escala]
>
>
> *Ideal: Imagen real o render del coche en pista, para contextualizar desde el principio.*
>

---

## El reto: autonomía en un entorno urbano

El coche contaba con un sistema de detección y seguimiento de líneas (DSL) que, gracias a visión por computador, le permitía mantenerse en su carril durante rectas y curvas. Algo muy similar a un sistema ADAS de un coche real medianamente moderno.

Sin embargo, este enfoque fallaba al llegar a una intersección: **no sabía qué hacer**. En años anteriores, otros equipos habían propuesto maniobras de tipo “bucle abierto”, es decir, movimientos predefinidos sin ninguna realimentación de donde se encuentra el vehículo.

### ¿Por qué el coche no sabía qué hacer?

La razón es que el DSL, aunque útil, tiene limitaciones muy marcadas:

- Está diseñado para seguir una **única línea continua** en el suelo, que representa el carril.
- En una intersección, la línea puede **desaparecer, dividirse o bifurcarse**, lo que provoca que:
    - El sistema pierda la referencia visual.
    - No tenga forma de decidir entre seguir recto o girar.
- Además, el comportamiento del coche está basado en **reacciones inmediatas** a lo que ve, sin planificación ni contexto.

> En resumen: el coche simplemente seguía lo que veía, y cuando esa referencia dejaba de ser clara o ambigua (como en un cruce), no tenía ningún criterio para decidir.
>

Y aquí es donde entró mi trabajo: dotar al coche de un sistema que pudiera **detectar en qué escenario estaba**, **planificar una trayectoria** y **actuar de forma coherente** en entornos más complejos.

> 🖼️ [Aquí encajaría un esquema básico explicativo del flujo: "entrada al cruce" → "decisión" → "salida"]
>
>
> *Una visualización rápida para contrastar el enfoque de bucle abierto frente a la planificación dinámica.*
>

---

## Solución: planificación por escenarios

Para solucionarlo, el vehículo debía **detectar automáticamente en qué tipo de segmento del circuito se encontraba**: ¿estaba en una recta? ¿En una curva? ¿Entrando en una rotonda o un cruce?

Para lograrlo, se desarrolló un nodo ROS que evaluaba tanto la posición del coche en el circuito (mediante odometría) como la forma de las líneas detectadas por el sistema de visión. Así, podía reconocer el contexto en el que se encontraba.

- Si estaba en una **recta** o una **curva**, el DSL tomara el control de la dirección.
- Si se detectaba una posición cercana una **rotonda** o un **cruce**, se activaba un planificador específico.
- Si estaba en una **recta** o una **curva**, dejábamos que el DSL tomara el control.
- Si detectábamos una **rotonda** o un **cruce**, activábamos un planificador específico.

> 📊 [Aquí un diagrama de bloques del sistema con los módulos ROS y su relación: DSL, detector de entorno, planificador, controlador]
>


> 🖼️ [Aquí una imagen del mapa topológico del circuito con etiquetas sobre los diferentes tipos de tramos]
>
>
> *Esto ayuda a visualizar cómo se contextualiza el coche en el entorno.*
>

---

## Planificación con curvas de Bézier y control proporcional

Para planificar trayectorias dentro de intersecciones, se utilizó **curvas de Bézier y splines**. En el caso de las rotondas, nos basamos en el enfoque propuesto por [González et al. (2016)](https://www.sciencedirect.com/science/article/abs/pii/S0957417416306583), mientras que para los cruces diseñamos una variante propia inspirada en el mismo artículo.

> 📷 [Aquí incluir una imagen con una trayectoria generada por curvas de Bézier sobre el mapa del circuito]
>

Una vez generada la trayectoria, otro nodo ROS se encargaba de seguirla utilizando un **controlador proporcional de orientación**, que ajustaba la dirección del coche en tiempo real para seguir la curva planificada.

> 🎥 Aquí embebido el vídeo de YouTube que muestra cómo funciona la trayectoria:
>
>
> *Ideal en este punto porque el lector ya tiene el contexto técnico y aprecia la demostración visual.*
>

---

## Resultado: un coche que se adapta al circuito

Gracias a este enfoque por escenarios y a la planificación específica en intersecciones, el coche fue capaz de recorrer **todo el circuito de forma autónoma**, adaptándose al entorno y tomando decisiones en tiempo real sobre qué trayectoria seguir.

Todo esto lo implementamos en **ROS 1** utilizando el entorno de simulación **Gazebo** que proporcionaban los organizadores.

👉 [github.com/grob0/adir](https://github.com/grob0/adir)

> 🖼️ [Aquí incluir la imagen de la trayectoria general completa (trayectoria_general.png)]
>
>
> *Buena forma de resumir gráficamente el alcance del sistema.*
>

> 🎥 [Y si tienes un vídeo de la simulación o del coche real funcionando, este sería el mejor lugar para incluirlo.]
>

---

## Mejoras a futuro

Aunque el sistema funcionó bien en la práctica, identificamos algunas mejoras importantes:

- Usar **odometría visual** o sensores adicionales para mejorar la precisión de localización.
- Sustituir el detector de escenarios por un modelo de **inteligencia artificial** basado solo en imagen.
- Incorporar un **planificador de rutas global** (como Dijkstra o A*) para que el coche no solo planifique cómo cruzar, sino **a dónde ir en cada bifurcación**.

> 📷 [Opcional: una imagen conceptual del flujo de decisión con A o de cómo podría integrarse un mapa global]*
>

---

## Conclusión

Este proyecto me permitió poner en práctica conceptos de visión por computador, robótica móvil, simulación y control, todo en un entorno realista y competitivo. Fue una experiencia increíblemente enriquecedora y desafiante que me permitió ver de cerca cómo se integran todos los componentes de un sistema autónomo.

---
