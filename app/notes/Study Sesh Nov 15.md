---
title: Señales, Semáforos y Sincronización
description: Notas de estudio sobre comunicación entre procesos, señales, semáforos, sincronización y problemas clásicos de sistemas operativos
category: Sistemas Operativos
date: 2025-11-15
---

## 1. Comunicación entre Procesos

### 1.1 Señales Bidireccionales

En la comunicación bidireccional, un proceso A envía una señal a B a través del kernel. El proceso B recibe la señal y realiza una acción. Posteriormente, B puede responder enviando algo de vuelta a A, quien procesa la respuesta o realiza otra acción correspondiente.

### 1.2 Señales Unidireccionales

La comunicación unidireccional representa un flujo de información en un solo sentido. El proceso A envía una señal a B, pero B no genera ninguna respuesta. El flujo de información es estrictamente A → B.

---

## 2. Tipos de Señales

### 2.1 Señales Personalizadas

**SIGUSR1 y SIGUSR2**

Estas señales sirven para indicar eventos personalizados entre procesos, activar comportamientos definidos por el programa, y enviar notificaciones entre procesos sin necesidad de usar pipes o sockets.

Patrón de uso típico:
- SIGUSR1 → Acción A
- SIGUSR2 → Acción B

### 2.2 Señales de Control de Procesos

| Señal | Nombre Completo | Descripción |
|-------|-----------------|-------------|
| SIGINT | Interrupt | Interrumpir proceso (equivalente a Ctrl+C) |
| SIGTERM | Terminate | Finalizar proceso de manera controlada |
| SIGKILL | Kill | Terminar proceso de inmediato (no puede ser ignorada) |
| SIGSTOP | Stop | Detener proceso |
| SIGCONT | Continue | Reanudar proceso detenido |
| SIGHUP | Hangup | Terminal colgada, típicamente usado para recarga de configuración en daemons |
| SIGQUIT | Quit | Finalizar proceso y generar core dump |

---

## 3. Sincronización con Semáforos

### 3.1 Definición

Un semáforo es una variable especial que puede tomar valores enteros no negativos y sirve como mecanismo de sincronización para:

1. Bloquear procesos o hilos cuando un recurso no está disponible
2. Desbloquearlos cuando el recurso vuelve a estar disponible

### 3.2 Clasificación de Semáforos

#### Semáforo Binario

Toma únicamente los valores 0 o 1. Se utiliza para proteger secciones críticas y funciona conceptualmente como un candado que puede estar abierto o cerrado.

#### Semáforo Contador

Puede tener valores mayores que 1. Se utiliza para permitir el acceso a recursos con múltiples unidades disponibles. Por ejemplo, un sistema con 5 conexiones disponibles utilizaría un semáforo contador inicializado en 5.

### 3.3 Operaciones Básicas

**wait() o P()**

Decrementa el valor del semáforo. Si el resultado es menor que 0, el proceso se bloquea hasta que otro proceso ejecute signal() sobre el mismo semáforo.

**signal() o V()**

Incrementa el valor del semáforo. Si había procesos bloqueados esperando por este semáforo, despierta uno de ellos.

### 3.4 Ejemplo: Acceso a Impresora Compartida

Considérese dos procesos que requieren acceso a una impresora compartida. Se utiliza un semáforo con valor inicial 1 (una sola impresora disponible):

1. Proceso A ejecuta wait(sem), el semáforo toma valor 0, y A obtiene acceso
2. Proceso B ejecuta wait(sem), pero como el semáforo es 0, B se bloquea
3. A termina su trabajo y ejecuta signal(sem), incrementando el semáforo a 1
4. B es desbloqueado y puede ahora acceder a la impresora

### 3.5 Aplicaciones de los Semáforos

Los semáforos permiten:

- Prevenir condiciones de carrera en acceso a recursos compartidos
- Proteger secciones críticas de código
- Coordinar el orden de ejecución entre procesos o hilos
- Limitar el acceso concurrente a recursos finitos

### 3.6 Problemas Clásicos de Sincronización

- Productor-Consumidor
- Lectores-Escritores
- Filósofos Comensales

---

## 4. Condiciones de Carrera

### 4.1 Definición

Una condición de carrera ocurre cuando dos o más procesos o hilos acceden y modifican el mismo recurso compartido simultáneamente, y el resultado final depende del orden específico en que se ejecuten las operaciones. Dado que este orden no está garantizado por el sistema operativo, el resultado del programa puede variar entre ejecuciones.

### 4.2 Demostración Experimental

El siguiente código en C ilustra una condición de carrera típica:

```c
#include <stdio.h>
#include <pthread.h>

int x = 0;

void* suma(void* arg) {
    for (int i = 0; i < 1000000; i++) {
        x = x + 1;   // Sección crítica sin protección
    }
    return NULL;
}

int main() {
    pthread_t h1, h2;

    pthread_create(&h1, NULL, suma, NULL);
    pthread_create(&h2, NULL, suma, NULL);

    pthread_join(h1, NULL);
    pthread_join(h2, NULL);

    printf("Valor final de x: %d\n", x);

    return 0;
}
```

**Resultados observados:**
- Primera ejecución: 2,000,000 (correcto)
- Segunda ejecución: 1,067,214 (incorrecto)

La discrepancia ocurre cuando los hilos están altamente intercalados. El CPU alterna constantemente entre ambos hilos, causando la pérdida de cientos de miles de incrementos debido a las intercalaciones.

### 4.3 Análisis del Mecanismo de Fallo

A nivel de procesador, la operación `x = x + 1` se descompone en tres pasos:

```c
temp = x;          // Lectura del valor desde memoria
temp = temp + 1;   // Incremento del valor
x = temp;          // Escritura del resultado en memoria
```

**Escenario de intercalación problemática:**

1. Hilo A lee x = 100
2. Hilo B lee x = 100
3. Hilo A suma 1, obteniendo 101
4. Hilo B suma 1, obteniendo 101
5. Hilo A escribe 101 en x
6. Hilo B escribe 101 en x

Resultado esperado: 102  
Resultado obtenido: 101  
Incrementos perdidos: 1

### 4.4 Solución: Exclusión Mutua

Para prevenir condiciones de carrera, se debe proteger la sección crítica usando mecanismos de exclusión mutua:

```c
pthread_mutex_lock(&lock);
x = x + 1;    // Solo un hilo puede ejecutar esta sección
pthread_mutex_unlock(&lock);
```

### 4.5 Mecanismos de Sincronización Disponibles

- Mutex (Mutual Exclusion)
- Semáforos binarios
- Locks
- Monitores

### 4.6 Programación Secuencial vs. Concurrente

**Un solo hilo (programa secuencial):**

En un programa que utiliza un único hilo de ejecución no existe concurrencia, por lo tanto no pueden ocurrir condiciones de carrera. En este modelo no se utiliza `pthread_create`.

Sin embargo, la programación secuencial sacrifica:
- Capacidad de multitarea
- Rendimiento potencial
- Paralelismo real
- Utilización de múltiples núcleos de procesamiento

**Múltiples hilos con sincronización:**

Es posible crear múltiples hilos pero permitir que solo uno entre en una sección específica mediante los mecanismos de sincronización mencionados anteriormente.

---

## 5. Gestión de Hilos y Recursos

### 5.1 Limitaciones de Memoria

El número de hilos que se pueden crear está limitado principalmente por la memoria disponible. Cada hilo posee su propio stack, y la suma total de estos stacks puede agotar la RAM del sistema.

**Cálculo aproximado:**

Con un stack de 1 MB por hilo:
- 1,000 hilos × 1 MB = 1 GB solo en stacks

### 5.2 Configuración del Stack en Linux

En sistemas Linux, cada hilo creado con pthreads tiene por defecto 8 MB de stack.

**Límites teóricos:**

- Máximo de procesos/hilos en el sistema: 92,853 (depende de la configuración del kernel)
- Con 16 GB de RAM y stack por defecto (8 MB): aproximadamente 2,000 hilos
- Con stack reducido a 1 MB: aproximadamente 16,000 hilos

### 5.3 Modificación del Tamaño del Stack

El tamaño del stack por hilo puede configurarse programáticamente:

```c
pthread_attr_t attr;
pthread_attr_init(&attr);
pthread_attr_setstacksize(&attr, 1024*1024); // 1 MB

pthread_create(&hilo, &attr, funcion, NULL);
```

### 5.4 Estándares POSIX

Según el estándar POSIX threads:

- PTHREAD_STACK_MIN = 16,384 bytes (aproximadamente 16 KB)
- Default en Linux = 8 MB

Cada sistema operativo establece un tamaño por defecto que es configurable por el programador.

---

## 6. Problema del Productor-Consumidor

### 6.1 Descripción del Problema

El problema del productor-consumidor es un problema clásico de sincronización que involucra:

- Un **productor** que genera datos y los coloca en un buffer
- Un **consumidor** que extrae datos del buffer y los procesa
- Un **buffer** de capacidad finita (por ejemplo, tamaño N = 10)

**Restricciones de sincronización:**

1. Si el buffer está lleno, el productor debe bloquearse hasta que haya espacio
2. Si el buffer está vacío, el consumidor debe bloquearse hasta que haya datos

### 6.2 Problemas en Ausencia de Sincronización

Sin mecanismos de sincronización adecuados, pueden ocurrir:

- Condiciones de carrera en el acceso al buffer
- Lectura de posiciones vacías por parte del consumidor
- Escritura en posiciones ya ocupadas por parte del productor
- Corrupción de la estructura del buffer

### 6.3 Mecanismos de Sincronización Requeridos

La solución al problema utiliza tres elementos de sincronización:

1. **mutex**: Proporciona acceso exclusivo al buffer, protegiendo la sección crítica
2. **empty**: Semáforo contador de espacios libres (valor inicial = N)
3. **full**: Semáforo contador de elementos disponibles (valor inicial = 0)

### 6.4 Semántica de los Semáforos

#### Semáforo empty

Representa el número de posiciones libres en el buffer.

- Valor inicial: N (tamaño del buffer, ya que inicia vacío)
- Utilizado por el productor para verificar disponibilidad de espacio
- Cuando el productor inserta un elemento: empty se decrementa
- Cuando el consumidor extrae un elemento: empty se incrementa

#### Semáforo full

Representa el número de elementos disponibles para consumir.

- Valor inicial: 0 (buffer vacío)
- Utilizado por el consumidor para verificar disponibilidad de datos
- Cuando el productor inserta un elemento: full se incrementa
- Cuando el consumidor extrae un elemento: full se decrementa

### 6.5 Ejemplo con Buffer de Tamaño 3

**Estado inicial:**
```
Buffer: [  ][  ][  ]
empty = 3, full = 0
```

**Después de inserción del productor:**
```
Buffer: [X][  ][  ]
empty = 2, full = 1
```

**Después de extracción del consumidor:**
```
Buffer: [  ][  ][  ]
empty = 3, full = 0
```

---

## 7. Estructura del Buffer

### 7.1 Buffer vs. Array

#### Array

Un array es simplemente un conjunto de posiciones contiguas en memoria. No posee:
- Comportamiento asociado
- Conocimiento de su estado (lleno/vacío)
- Lógica de inserción o extracción

#### Buffer

Un buffer es una abstracción que combina un array con lógica adicional:

- Punteros de entrada (in) y salida (out)
- Tamaño máximo definido
- Contador de elementos actuales
- Comportamiento FIFO (First In, First Out)
- Manejo circular del espacio
- Mecanismos de sincronización (mutex/semáforos)

### 7.2 Punteros de Posición

**in**: Indica la posición donde se insertará el próximo elemento (utilizado por el productor)

**out**: Indica la posición de donde se extraerá el próximo elemento (utilizado por el consumidor)

### 7.3 Analogía: Sistema de Bar

Para ilustrar el funcionamiento del buffer circular, considérese la siguiente analogía:

| Componente | Analogía |
|------------|----------|
| Productor | Bartender que prepara y sirve bebidas |
| Consumidor | Cliente que consume bebidas |
| Buffer | Barra del bar |
| Puntero in | Próxima posición donde el bartender coloca una bebida |
| Puntero out | Próxima posición de donde el cliente toma una bebida |
| Buffer lleno | Barra llena, bartender debe esperar |
| Buffer vacío | Sin bebidas, cliente debe esperar |
| Naturaleza circular | Las posiciones se recorren y retornan al inicio |

### 7.4 Operaciones No Atómicas

No se debe consultar el estado del buffer directamente usando múltiples hilos porque:

- La operación de consulta no es atómica
- Puede ser interrumpida en medio de su ejecución
- Los hilos pueden interferir con el estado observado por otros

Los semáforos empty y full proporcionan una forma segura y atómica de medir el estado del buffer.

**Definición**: Una operación atómica es aquella que se ejecuta completamente sin posibilidad de interrupción, garantizando que no habrá interferencia de otros hilos.

### 7.5 Roles Distintos: Mutex vs. Punteros

#### Función del Mutex

- Protege contra acceso concurrente
- Previene escritura simultánea
- Previene lectura simultánea
- Evita estados corruptos del buffer

#### Función de los Punteros in y out

- Indican dónde colocar el próximo elemento
- Indican de dónde extraer el siguiente elemento
- Permiten determinar si el buffer está lleno o vacío
- Son componentes estructurales del buffer

### 7.6 Consecuencias de la Ausencia de Punteros

En ausencia de los punteros in y out:

- El productor no puede determinar dónde insertar nuevos elementos
- El consumidor no puede identificar qué elementos están disponibles
- No existe forma de determinar el estado de ocupación del buffer
- El buffer pierde su funcionalidad como estructura de datos

La situación sería equivalente a un bartender colocando bebidas en posiciones aleatorias de la barra, sin ningún orden o sistema.

---

## 8. Conclusiones

### 8.1 Conceptos Fundamentales

1. **Señales**: Mecanismo de comunicación unidireccional y bidireccional entre procesos
2. **Semáforos**: Variables de sincronización para coordinar el acceso a recursos compartidos
3. **Condiciones de carrera**: Errores resultantes de acceso concurrente no sincronizado
4. **Mutex**: Mecanismo de exclusión mutua para proteger secciones críticas
5. **Buffer**: Estructura de datos con lógica FIFO y manejo circular

### 8.2 Principios de Programación Concurrente

La correcta implementación de sistemas concurrentes requiere:

- Protección de todas las secciones críticas
- Uso apropiado de semáforos para coordinar acceso a recursos
- Comprensión de la diferencia entre paralelismo y concurrencia
- Consideración de los límites de recursos del sistema (RAM, CPU)
- Diseño basado en operaciones atómicas

---

**Notas**: Este documento presenta los fundamentos de señales, semáforos y sincronización en sistemas operativos, con ejemplos implementados en C y analogías para facilitar la comprensión de conceptos abstractos.