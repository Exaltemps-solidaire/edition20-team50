"use client";

import { useState } from "react";
import styles from "./page.module.css";
import {
  affecterIncident,
  declarerIncident,
  incidentsExemple,
  incidentsOuverts,
  libelleGravite,
  libelleStatut,
  personas,
  peutQualifier,
  prestatairesExemple,
  validerDeclaration,
  type ErreursDeclaration,
  type Gravite,
  type Incident,
  type Persona,
} from "./incidents-exemple";

const graviteParDefaut: Gravite = "intervention_rapide";

export default function Home() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>(incidentsExemple);
  const [terrain, setTerrain] = useState("");
  const [equipement, setEquipement] = useState("");
  const [description, setDescription] = useState("");
  const [gravite, setGravite] = useState<Gravite>(graviteParDefaut);
  const [erreurs, setErreurs] = useState<ErreursDeclaration>({});
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>(undefined);

  function choisirPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const fichier = event.target.files?.[0];
    if (!fichier) {
      setPhotoDataUrl(undefined);
      return;
    }
    const lecteur = new FileReader();
    lecteur.onload = () => setPhotoDataUrl(lecteur.result as string);
    lecteur.readAsDataURL(fichier);
  }

  function declarer(event: React.FormEvent) {
    event.preventDefault();
    const erreursTrouvees = validerDeclaration({ terrain, equipement });
    setErreurs(erreursTrouvees);
    if (Object.keys(erreursTrouvees).length > 0) {
      return;
    }
    setIncidents((courants) => declarerIncident(courants, { terrain, equipement, description, gravite, photoDataUrl }));
    setTerrain("");
    setEquipement("");
    setDescription("");
    setGravite(graviteParDefaut);
    setPhotoDataUrl(undefined);
  }

  function qualifier(incidentId: string, event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const donnees = new FormData(event.currentTarget);
    setIncidents((courants) =>
      affecterIncident(courants, incidentId, {
        priorite: donnees.get("priorite") as Gravite,
        prestataire: donnees.get("prestataire") as string,
        delai: donnees.get("delai") as string,
      }),
    );
  }

  if (!persona) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <h1>Qui êtes-vous ?</h1>
          <p>Choisissez la personne que vous incarnez pour cette démonstration.</p>
          <ul className={styles.listePersonas}>
            {personas.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => setPersona(p)}>
                  <strong>{p.nom}</strong>
                  <span>{p.libelleRole}</span>
                </button>
              </li>
            ))}
          </ul>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.entete}>
          <div>
            <strong>{persona.nom}</strong> — {persona.libelleRole}
          </div>
          <button type="button" onClick={() => setPersona(null)}>
            Changer de rôle
          </button>
        </header>
        {(persona.role === "rst" || persona.role === "educateur") && (
          <form className={styles.formulaire} onSubmit={declarer} noValidate>
            <h2>Déclarer un incident</h2>
            <label>
              Terrain
              <input value={terrain} onChange={(e) => setTerrain(e.target.value)} />
              {erreurs.terrain && <span className={styles.erreur}>{erreurs.terrain}</span>}
            </label>
            <label>
              Équipement
              <input value={equipement} onChange={(e) => setEquipement(e.target.value)} />
              {erreurs.equipement && <span className={styles.erreur}>{erreurs.equipement}</span>}
            </label>
            <label>
              Description
              <input value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label>
              Gravité
              <select value={gravite} onChange={(e) => setGravite(e.target.value as Gravite)}>
                <option value="urgence_securite">{libelleGravite("urgence_securite")}</option>
                <option value="intervention_rapide">{libelleGravite("intervention_rapide")}</option>
                <option value="intervention_programmee">{libelleGravite("intervention_programmee")}</option>
              </select>
            </label>
            <label>
              Photo (optionnelle)
              <input type="file" accept="image/*" onChange={choisirPhoto} />
            </label>
            {photoDataUrl && <img src={photoDataUrl} alt="Aperçu" className={styles.apercuPhoto} />}
            <button type="submit">Déclarer</button>
          </form>
        )}
        <h1>Incidents ouverts</h1>
        <ul className={styles.listeIncidents}>
          {incidentsOuverts(incidents).map((incident) => (
            <li key={incident.id}>
              <div className={styles.incidentEntete}>
                <strong>{incident.terrain}</strong>
                <span>{libelleStatut(incident.statut)}</span>
              </div>
              <div>{incident.equipement} — {incident.description}</div>
              <div>{libelleGravite(incident.gravite)}</div>
              {incident.photoDataUrl && (
                <img src={incident.photoDataUrl} alt="Photo du signalement" className={styles.miniaturePhoto} />
              )}
              {incident.statut === "affecte" && incident.priorite && (
                <div>
                  Priorité : {libelleGravite(incident.priorite)} — Prestataire : {incident.prestataireAffecte} (délai : {incident.delai})
                </div>
              )}
              {persona.role && peutQualifier(persona.role) && incident.statut === "declare" && (
                <form className={styles.formulaireQualification} onSubmit={(e) => qualifier(incident.id, e)}>
                  <select name="priorite" defaultValue="intervention_rapide">
                    <option value="urgence_securite">{libelleGravite("urgence_securite")}</option>
                    <option value="intervention_rapide">{libelleGravite("intervention_rapide")}</option>
                    <option value="intervention_programmee">{libelleGravite("intervention_programmee")}</option>
                  </select>
                  <select name="prestataire" defaultValue={prestatairesExemple[0].nom}>
                    {prestatairesExemple.map((p) => (
                      <option key={p.id} value={p.nom}>
                        {p.nom}
                      </option>
                    ))}
                  </select>
                  <input name="delai" placeholder="Délai (ex. 3 jours)" defaultValue="3 jours" />
                  <button type="submit">Affecter</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
