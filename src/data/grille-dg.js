export const GRILLE_DATA_DG = [
  {
    "id": "support",
    "name": "Support de présentation",
    "color": "bleu",
    "items": [
      {
        "id": "itm_structure",
        "name": "Structure",
        "pts": 10,
        "modality": "check",
        "config": {
          "pills": [
            { "label": "Introduction / Problématique / Plan", "pts": 2 },
            { "label": "P1 - Présentation personnelle",       "pts": 2 },
            { "label": "P2 - Présentation des recherches",    "pts": 2 },
            { "label": "P3 - Présentation Fiche Métier",      "pts": 2 },
            { "label": "Conclusion",                          "pts": 2 }
          ]
        }
      },
      {
        "id": "itm_esthetisme",
        "name": "Esthétisme",
        "pts": 10,
        "modality": "columns",
        "config": {
          "pas": 1,
          "levels": [
            { "label": "Choix de taille et police non pertinents, pas d'identité visuelle reconnaissable, couleurs mal choisies, trop de texte, peu d'images", "max": 2,  "color": "rouge" },
            { "label": "Quelques choix graphiques et des images mais ensemble peu cohérent et harmonieux",                                                      "max": 6,  "color": "orange" },
            { "label": "Identité visuelle forte et pertinente, ensemble beau et harmonieux.",                                                                   "max": 10, "color": "vert" }
          ]
        }
      }
    ]
  },
  {
    "id": "oral",
    "name": "Expression orale",
    "color": "violet",
    "items": [
      {
        "id": "itm_orateur",
        "name": "Orateur",
        "pts": 10,
        "modality": "level",
        "config": {
          "groups": [
            {
              "title": "Tenue / Posture",
              "levels": [
                { "label": "S'adosse au mur, mains dans les poches", "pts": 0, "color": "rouge" },
                { "label": "Posture de candidat, se tient droit",     "pts": 1, "color": "orange" },
                { "label": "+ Tenue soignée",                         "pts": 2, "color": "vert" }
              ]
            },
            {
              "title": "Voix",
              "levels": [
                { "label": "Difficile à comprendre",                               "pts": 1, "color": "rouge" },
                { "label": "Parle de façon audible mais sans articuler",           "pts": 2, "color": "orange" },
                { "label": "Parle fort, articule bien, expression claire et fluide","pts": 3, "color": "vert" }
              ]
            },
            {
              "title": "Lecture",
              "levels": [
                { "label": "Lecture dominante", "pts": 1, "color": "rouge" },
                { "label": "Alternance",         "pts": 2, "color": "orange" },
                { "label": "Détaché",            "pts": 3, "color": "vert" }
              ]
            },
            {
              "title": "Énergie",
              "levels": [
                { "label": "Endormi",                        "pts": 0, "color": "rouge" },
                { "label": "Monotone",                       "pts": 1, "color": "orange" },
                { "label": "Dynamique, intonations variées", "pts": 2, "color": "vert" }
              ]
            }
          ]
        }
      },
      {
        "id": "itm_langage",
        "name": "Langage",
        "pts": 10,
        "modality": "columns",
        "config": {
          "pas": 1,
          "levels": [
            { "label": "Langage inadapté, trop de familiarités, pas de vocabulaire spécifique",                 "max": 2,  "color": "rouge" },
            { "label": "Langage adapté dans l'ensemble, quelques familiarités, vocabulaire spécifique partiel", "max": 6,  "color": "orange" },
            { "label": "Langage adapté, choix des mots pertinent, vocabulaire spécialisé employé",              "max": 10, "color": "vert" }
          ]
        }
      },
      {
        "id": "itm_animation",
        "name": "Animation",
        "pts": 10,
        "modality": "level",
        "config": {
          "groups": [
            {
              "title": "Durée",
              "levels": [
                { "label": "≤ 3 min",      "pts": 0, "color": "rouge" },
                { "label": "3 - 4'30 min", "pts": 2, "color": "orange" },
                { "label": "5 min ±30''",  "pts": 4, "color": "vert" }
              ]
            },
            {
              "title": "Usage du support",
              "levels": [
                { "label": "Support ignoré",                "pts": 0, "color": "rouge" },
                { "label": "Regarde ses diapos",            "pts": 2, "color": "orange" },
                { "label": "Appui / Pointe pour illustrer", "pts": 4, "color": "vert" }
              ]
            },
            {
              "title": "Transitions",
              "levels": [
                { "label": "Aucune",            "pts": 0, "color": "rouge" },
                { "label": "De temps en temps", "pts": 1, "color": "orange" },
                { "label": "Toujours",          "pts": 2, "color": "vert" }
              ]
            }
          ]
        }
      },
      {
        "id": "item_vjphmgz",
        "name": "Échanges",
        "pts": 10,
        "modality": "columns",
        "config": {
          "pas": 1,
          "levels": [
            { "label": "Réponse « à côté ».\nET / OU\nRéponses fermées.",               "max": 2,  "color": "rouge" },
            { "label": "Réponse à la question.\nRéponses simples.\nAvec « aides » du jury", "max": 5,  "color": "orange" },
            { "label": "Réponse à la question.\nRéponses simples.",                          "max": 8,  "color": "vert" },
            { "label": "Réponse à la question.\nRéponses riches.\n(précisions et ex. variés)", "max": 10, "color": "vert" }
          ]
        }
      }
    ]
  },
  {
    "id": "contenu",
    "name": "Contenu",
    "color": "vert",
    "items": [
      {
        "id": "itm_fil",
        "name": "Fil conducteur",
        "pts": 10,
        "modality": "level",
        "config": {
          "groups": [
            {
              "title": "Problématique",
              "levels": [
                { "label": "Aucune",            "pts": 0, "color": "rouge" },
                { "label": "Annoncée",          "pts": 1, "color": "orange" },
                { "label": "Annoncée + Claire", "pts": 2, "color": "vert" }
              ]
            },
            {
              "title": "Plan",
              "levels": [
                { "label": "Aucun",           "pts": 0, "color": "rouge" },
                { "label": "Annoncé",         "pts": 2, "color": "orange" },
                { "label": "Annoncé + Suivi", "pts": 4, "color": "vert" }
              ]
            },
            {
              "title": "Réponse en conclusion",
              "levels": [
                { "label": "Absence de réponse", "pts": 0, "color": "rouge" },
                { "label": "Réponse donnée",     "pts": 2, "color": "orange" },
                { "label": "Réponse claire",     "pts": 4, "color": "vert" }
              ]
            }
          ]
        }
      },
      {
        "id": "itm_p1",
        "name": "P1 - Présentation",
        "pts": 10,
        "modality": "columns",
        "config": {
          "pas": 1,
          "levels": [
            { "label": "Présentation très limitée",                                          "max": 2,  "color": "rouge" },
            { "label": "Quelques éléments personnels",                                        "max": 5,  "color": "orange" },
            { "label": "Présentation pertinente de ses goûts, qualités, centres d'intérêt",  "max": 8,  "color": "vert" },
            { "label": "Réflexion approfondie sur sa personnalité et ses aspirations",        "max": 10, "color": "vert" }
          ]
        }
      },
      {
        "id": "itm_p2",
        "name": "P2 - Fiche Métier",
        "pts": 10,
        "modality": "level",
        "config": {
          "groups": [
            {
              "title": "Description",
              "levels": [
                { "label": "Absence de description",               "pts": 0, "color": "rouge" },
                { "label": "Énumère les missions sans les décrire", "pts": 1, "color": "orange" },
                { "label": "Énumère les missions en les décrivant", "pts": 2, "color": "vert" }
              ]
            },
            {
              "title": "Qualités requises",
              "levels": [
                { "label": "Aucune qualité énoncée", "pts": 0, "color": "rouge" },
                { "label": "Énumère des qualités",   "pts": 2, "color": "orange" },
                { "label": "Lie avec le métier",     "pts": 4, "color": "vert" }
              ]
            },
            {
              "title": "Formation / Études",
              "levels": [
                { "label": "Aucune formation énoncée",          "pts": 0, "color": "rouge" },
                { "label": "Donne la formation / études",       "pts": 2, "color": "orange" },
                { "label": "Explique les formations / études",  "pts": 4, "color": "vert" }
              ]
            }
          ]
        }
      },
      {
        "id": "itm_p3",
        "name": "P3 - Ce Métier & Moi",
        "pts": 10,
        "modality": "level",
        "config": {
          "groups": [
            {
              "title": "Lien avec soi",
              "levels": [
                { "label": "Aucun lien établi entre le métier et lui/elle",                         "pts": 0, "color": "rouge" },
                { "label": "Quelques liens évoqués (qualités ou tâches)",                            "pts": 2, "color": "orange" },
                { "label": "Lien clair et argumenté entre ses qualités/aspirations et le métier",   "pts": 4, "color": "vert" }
              ]
            },
            {
              "title": "Stage en 3e",
              "levels": [
                { "label": "Aucun stage",                          "pts": 0, "color": "rouge" },
                { "label": "Des idées de lieux",                   "pts": 2, "color": "orange" },
                { "label": "Identifié (adresse + coordonnées)",    "pts": 3, "color": "vert" }
              ]
            },
            {
              "title": "Cohérence",
              "levels": [
                { "label": "Projet incohérent avec son profil ou ses résultats", "pts": 0, "color": "rouge" },
                { "label": "Cohérence partielle, réalisable si aménagement",     "pts": 2, "color": "orange" },
                { "label": "Projet réaliste et cohérent avec son profil actuel", "pts": 4, "color": "vert" }
              ]
            }
          ]
        }
      }
    ]
  }
];
