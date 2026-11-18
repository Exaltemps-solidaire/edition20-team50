import { describe, expect, it } from "vitest";
import {
  affecterIncident,
  declarerIncident,
  incidentsOuverts,
  libelleGravite,
  peutQualifier,
  validerDeclaration,
  type Incident,
} from "./incidents-exemple";

describe("incidentsOuverts", () => {
  it("exclut les incidents clôturés et garde les autres", () => {
    const incidents: Incident[] = [
      { id: "a", terrain: "T1", equipement: "E1", description: "", gravite: "urgence_securite", statut: "declare" },
      { id: "b", terrain: "T2", equipement: "E2", description: "", gravite: "intervention_rapide", statut: "cloture" },
      { id: "c", terrain: "T3", equipement: "E3", description: "", gravite: "intervention_programmee", statut: "affecte" },
    ];

    expect(incidentsOuverts(incidents).map((incident) => incident.id)).toEqual(["a", "c"]);
  });
});

describe("libelleGravite", () => {
  it("traduit chaque niveau de gravité", () => {
    expect(libelleGravite("urgence_securite")).toBe("Urgence sécurité");
    expect(libelleGravite("intervention_rapide")).toBe("Intervention rapide");
    expect(libelleGravite("intervention_programmee")).toBe("Intervention programmée");
  });
});

describe("validerDeclaration", () => {
  it("signale les champs obligatoires manquants", () => {
    expect(validerDeclaration({ terrain: "", equipement: "" })).toEqual({
      terrain: "Le terrain est obligatoire.",
      equipement: "L'équipement est obligatoire.",
    });
  });

  it("ne remonte aucune erreur quand les champs sont remplis", () => {
    expect(validerDeclaration({ terrain: "Terrain X", equipement: "But de foot" })).toEqual({});
  });
});

describe("declarerIncident", () => {
  it("ajoute le nouvel incident en tête avec le statut déclaré", () => {
    const incidents: Incident[] = [
      { id: "a", terrain: "T1", equipement: "E1", description: "", gravite: "urgence_securite", statut: "declare" },
    ];

    const resultat = declarerIncident(incidents, {
      terrain: "Terrain Y",
      equipement: "Filet",
      description: "Trou dans le filet",
      gravite: "intervention_rapide",
    });

    expect(resultat).toHaveLength(2);
    expect(resultat[0]).toMatchObject({
      terrain: "Terrain Y",
      equipement: "Filet",
      statut: "declare",
    });
    expect(resultat[0].photoDataUrl).toBeUndefined();
  });

  it("conserve la photo jointe quand elle est fournie", () => {
    const resultat = declarerIncident([], {
      terrain: "Terrain Z",
      equipement: "Poteau",
      description: "",
      gravite: "intervention_programmee",
      photoDataUrl: "data:image/png;base64,abc123",
    });

    expect(resultat[0].photoDataUrl).toBe("data:image/png;base64,abc123");
  });
});

describe("affecterIncident", () => {
  it("fait passer l'incident au statut affecté avec priorité et prestataire, sans toucher les autres", () => {
    const incidents: Incident[] = [
      { id: "a", terrain: "T1", equipement: "E1", description: "", gravite: "urgence_securite", statut: "declare" },
      { id: "b", terrain: "T2", equipement: "E2", description: "", gravite: "intervention_rapide", statut: "declare" },
    ];

    const resultat = affecterIncident(incidents, "a", {
      priorite: "urgence_securite",
      prestataire: "SportRénov",
      delai: "48h",
    });

    expect(resultat.find((i) => i.id === "a")).toMatchObject({
      statut: "affecte",
      priorite: "urgence_securite",
      prestataireAffecte: "SportRénov",
      delai: "48h",
    });
    expect(resultat.find((i) => i.id === "b")).toMatchObject({ statut: "declare" });
  });
});

describe("peutQualifier", () => {
  it("autorise uniquement le rôle référente", () => {
    expect(peutQualifier("referente")).toBe(true);
    expect(peutQualifier("rst")).toBe(false);
    expect(peutQualifier("educateur")).toBe(false);
  });
});
