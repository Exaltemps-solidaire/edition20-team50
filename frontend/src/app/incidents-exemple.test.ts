import { describe, expect, it } from "vitest";
import { incidentsOuverts, libelleGravite, type Incident } from "./incidents-exemple";

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
