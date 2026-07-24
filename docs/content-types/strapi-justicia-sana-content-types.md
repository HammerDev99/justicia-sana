# Content Types Strapi para Justicia Sana — Portal CCL Seccional Magdalena

> Contrato de datos entre Strapi y el cliente tipado en `src/lib/strapi.ts` / `src/lib/types.ts`. Este documento es la **fuente de verdad del esquema**; los nombres de `attributes` deben coincidir literalmente con los tipos de dominio en `src/lib/types.ts`.
>
> **Dónde se materializan estos esquemas**: en `production` Strapi desactiva el Content-Type Builder, así que estos 9 content types **no se crean por UI** sino como archivos de esquema (`src/api/**/content-types/**/schema.json`) en un proyecto Strapi versionado (repo previsto `justicia-sana-cms`), traducidos desde este contrato. Ver `docs/plannings/P02_STRAPI_PRODUCCION.md` (Fase B) y `docs/DEPLOYMENT_STRAPI.md` (Paso 4).

## Mapa de trazabilidad (GAP de P00 → Content Type → Fase de P01)

| Content Type         | Tipo       | GAP (P00) | Fase (P01) |
| -------------------- | ---------- | --------- | ---------- |
| `norma`              | Collection | G-02      | F3-02      |
| `articulo`           | Collection | G-04      | F3-04      |
| `recurso-pedagogico` | Collection | G-03      | F3-03      |
| `integrante-comite`  | Collection | G-01      | F3-01      |
| `capacitacion`       | Collection | G-13      | F3-06      |
| `comunicado`         | Collection | G-14      | F3-06      |
| `canal-ayuda`        | Collection | G-05      | F3-05      |
| `quienes-somos`      | Single     | G-01      | F3-01      |
| `home`               | Single     | —         | F2-04      |

---

## 1. Norma (Biblioteca de normativa)

```json
{
  "kind": "collectionType",
  "collectionName": "normas",
  "info": {
    "singularName": "norma",
    "pluralName": "normas",
    "displayName": "Norma"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "titulo": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "slug": {
      "type": "uid",
      "targetField": "titulo",
      "required": true
    },
    "tipo_norma": {
      "type": "enumeration",
      "enum": ["Ley", "Resolución", "Decreto", "Circular", "Otro"],
      "required": true
    },
    "numero": {
      "type": "string",
      "required": true,
      "maxLength": 50
    },
    "anio": {
      "type": "integer",
      "required": true,
      "min": 1990,
      "max": 2100
    },
    "resumen_lenguaje_claro": {
      "type": "richtext",
      "required": true
    },
    "texto_completo_url": {
      "type": "string"
    },
    "archivo_pdf": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["files"]
    },
    "estado_vigencia": {
      "type": "enumeration",
      "enum": ["Vigente", "Derogada", "Modificada"],
      "required": true,
      "default": "Vigente"
    },
    "fecha_expedicion": {
      "type": "date"
    },
    "orden_visualizacion": {
      "type": "integer",
      "default": 0
    }
  }
}
```

## 2. Articulo (Noticias, jurisprudencia, campañas)

```json
{
  "kind": "collectionType",
  "collectionName": "articulos",
  "info": {
    "singularName": "articulo",
    "pluralName": "articulos",
    "displayName": "Artículo"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "titulo": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "slug": {
      "type": "uid",
      "targetField": "titulo",
      "required": true
    },
    "categoria": {
      "type": "enumeration",
      "enum": ["Noticia", "Jurisprudencia", "Campaña"],
      "required": true
    },
    "resumen": {
      "type": "text",
      "required": true,
      "maxLength": 300
    },
    "cuerpo": {
      "type": "richtext",
      "required": true
    },
    "imagen_destacada": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "fecha_publicacion": {
      "type": "date",
      "required": true
    },
    "autor": {
      "type": "string",
      "maxLength": 100
    }
  }
}
```

## 3. Recurso Pedagógico (Material educativo)

```json
{
  "kind": "collectionType",
  "collectionName": "recursos_pedagogicos",
  "info": {
    "singularName": "recurso-pedagogico",
    "pluralName": "recursos-pedagogicos",
    "displayName": "Recurso Pedagógico"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "titulo": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "slug": {
      "type": "uid",
      "targetField": "titulo",
      "required": true
    },
    "tipo_recurso": {
      "type": "enumeration",
      "enum": ["Infografía", "Folleto", "Video", "Guía"],
      "required": true
    },
    "tema": {
      "type": "enumeration",
      "enum": [
        "Qué es acoso laboral",
        "Modalidades de acoso",
        "Cómo actuar (víctima)",
        "Cómo actuar (testigo)",
        "Otro"
      ],
      "required": true
    },
    "descripcion": {
      "type": "text",
      "required": true,
      "maxLength": 400
    },
    "archivo": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["files", "images"]
    },
    "url_video": {
      "type": "string"
    },
    "orden_visualizacion": {
      "type": "integer",
      "default": 0
    }
  }
}
```

## 4. Integrante Comité (Estructura del CCL)

```json
{
  "kind": "collectionType",
  "collectionName": "integrantes_comite",
  "info": {
    "singularName": "integrante-comite",
    "pluralName": "integrantes-comite",
    "displayName": "Integrante del Comité"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "nombre": {
      "type": "string",
      "required": true,
      "maxLength": 150
    },
    "rol": {
      "type": "enumeration",
      "enum": [
        "Presidente/a",
        "Secretario/a",
        "Representante del empleador",
        "Representante de los empleados"
      ],
      "required": true
    },
    "foto": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["images"]
    },
    "biografia_breve": {
      "type": "text",
      "maxLength": 500
    },
    "orden_visualizacion": {
      "type": "integer",
      "default": 0
    }
  }
}
```

## 5. Capacitación (Calendario informativo)

```json
{
  "kind": "collectionType",
  "collectionName": "capacitaciones",
  "info": {
    "singularName": "capacitacion",
    "pluralName": "capacitaciones",
    "displayName": "Capacitación"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "titulo": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "descripcion": {
      "type": "text",
      "required": true,
      "maxLength": 500
    },
    "fecha": {
      "type": "datetime",
      "required": true
    },
    "modalidad": {
      "type": "enumeration",
      "enum": ["Presencial", "Virtual"],
      "required": true
    },
    "enlace_inscripcion": {
      "type": "string"
    },
    "cupo_maximo": {
      "type": "integer"
    }
  }
}
```

## 6. Comunicado (Boletines del CCL)

```json
{
  "kind": "collectionType",
  "collectionName": "comunicados",
  "info": {
    "singularName": "comunicado",
    "pluralName": "comunicados",
    "displayName": "Comunicado"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "titulo": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "cuerpo": {
      "type": "richtext",
      "required": true
    },
    "fecha": {
      "type": "date",
      "required": true
    },
    "archivo_adjunto": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["files"]
    }
  }
}
```

## 7. Canal de Ayuda (Contacto y apoyo psicológico)

```json
{
  "kind": "collectionType",
  "collectionName": "canales_ayuda",
  "info": {
    "singularName": "canal-ayuda",
    "pluralName": "canales-ayuda",
    "displayName": "Canal de Ayuda"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "nombre": {
      "type": "string",
      "required": true,
      "maxLength": 150
    },
    "tipo_canal": {
      "type": "enumeration",
      "enum": ["Atención psicológica", "Contacto del Comité", "Soporte técnico", "Otro"],
      "required": true
    },
    "telefono": {
      "type": "string",
      "maxLength": 30
    },
    "correo": {
      "type": "email"
    },
    "horario": {
      "type": "string",
      "maxLength": 150
    },
    "descripcion": {
      "type": "text",
      "maxLength": 400
    },
    "orden_visualizacion": {
      "type": "integer",
      "default": 0
    }
  }
}
```

## 8. Quiénes Somos (Single Type)

```json
{
  "kind": "singleType",
  "collectionName": "quienes_somos",
  "info": {
    "singularName": "quienes-somos",
    "pluralName": "quienes-somos",
    "displayName": "Quiénes Somos"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "mision": {
      "type": "richtext",
      "required": true
    },
    "funciones": {
      "type": "richtext",
      "required": true
    },
    "reglamento_pdf": {
      "type": "media",
      "multiple": false,
      "allowedTypes": ["files"]
    }
  }
}
```

## 9. Home (Single Type)

```json
{
  "kind": "singleType",
  "collectionName": "home",
  "info": {
    "singularName": "home",
    "pluralName": "home",
    "displayName": "Página de Inicio"
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "titulo_hero": {
      "type": "string",
      "required": true,
      "maxLength": 150
    },
    "subtitulo_hero": {
      "type": "text",
      "maxLength": 300
    },
    "texto_bienvenida": {
      "type": "richtext"
    }
  }
}
```

---

## Convenciones aplicadas (heredadas de rugby-bello-site)

- `draftAndPublish: true` en todos los content types — el CCL controla explícitamente qué está publicado; el cliente tipado (`fetchCollection`/`fetchSingle`) solo recibe entradas publicadas por diseño de la API de Strapi.
- Nombres de `attributes` en `snake_case` español — el dominio es en español (regla crítica "responder en español, código en inglés"); las funciones/tipos TypeScript que los consumen sí van en inglés (`fetchNormas`, `Norma`, etc.), solo los nombres de campo Strapi quedan en español porque los edita el CCL directamente en el Admin.
- Sin relaciones (`relation`) entre content types en esta primera versión — mantiene el modelo simple para el piloto; se evalúa en fases posteriores si `articulo` necesita relacionarse con `norma` (p. ej. jurisprudencia que cita una ley específica).
- Ningún content type almacena datos personales de terceros ajenos al CCL (regla crítica 3: nada confidencial en este repo/sitio) — `integrante-comite` son cargos públicos del propio Comité, no denunciantes ni denunciados.
