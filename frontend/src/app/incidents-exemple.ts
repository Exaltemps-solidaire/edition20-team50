// Données et logique métier de l'écran d'accueil. Pas d'appel API dans cette itération :
// les incidents sont en dur, l'API réelle arrive dans une itération suivante.

export type Role = "rst" | "referente" | "educateur" | "prestataire" | "directeur";

export type Persona = {
  id: string;
  nom: string;
  role: Role;
  libelleRole: string;
};

export const personas: Persona[] = [
  { id: "p1", nom: "Awa Diallo", role: "rst", libelleRole: "Responsable sportif territorial" },
  { id: "p2", nom: "Nadia Haddad", role: "referente", libelleRole: "Référente de l'association" },
  { id: "p3", nom: "Karim Belkacem", role: "educateur", libelleRole: "Éducateur sportif" },
  { id: "p4", nom: "Les Ateliers du Rhône", role: "prestataire", libelleRole: "Prestataire" },
  { id: "p5", nom: "Julien Morel", role: "directeur", libelleRole: "Directeur national des infrastructures" },
];

export type Gravite = "urgence_securite" | "intervention_rapide" | "intervention_programmee";
export type StatutIncident = "declare" | "affecte" | "en_cours" | "verifie" | "cloture";

export type Incident = {
  id: string;
  terrain: string;
  equipement: string;
  description: string;
  gravite: Gravite;
  statut: StatutIncident;
};

export const incidentsExemple: Incident[] = [
  {
    id: "i1",
    terrain: "Terrain Mermoz (Lyon 8e)",
    equipement: "But de foot",
    description: "Filet déchiré, poteau instable",
    gravite: "urgence_securite",
    statut: "declare",
  },
  {
    id: "i2",
    terrain: "Terrain Les Minguettes (Vénissieux)",
    equipement: "Panier de basket",
    description: "Cerclage desserré",
    gravite: "intervention_rapide",
    statut: "declare",
  },
  {
    id: "i3",
    terrain: "Terrain La Duchère (Lyon 9e)",
    equipement: "Agrès de musculation",
    description: "Rouille sur les fixations",
    gravite: "intervention_programmee",
    statut: "affecte",
  },
];

export function incidentsOuverts(incidents: Incident[]): Incident[] {
  return incidents.filter((incident) => incident.statut !== "cloture");
}

export function libelleGravite(gravite: Gravite): string {
  switch (gravite) {
    case "urgence_securite":
      return "Urgence sécurité";
    case "intervention_rapide":
      return "Intervention rapide";
    case "intervention_programmee":
      return "Intervention programmée";
  }
}

export function libelleStatut(statut: StatutIncident): string {
  switch (statut) {
    case "declare":
      return "Déclaré";
    case "affecte":
      return "Affecté";
    case "en_cours":
      return "En cours";
    case "verifie":
      return "Vérifié";
    case "cloture":
      return "Clôturé";
  }
}
