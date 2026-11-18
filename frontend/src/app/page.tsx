"use client";

import { useState } from "react";
import styles from "./page.module.css";
import {
  incidentsExemple,
  incidentsOuverts,
  libelleGravite,
  libelleStatut,
  personas,
  type Persona,
} from "./incidents-exemple";

export default function Home() {
  const [persona, setPersona] = useState<Persona | null>(null);

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
        <h1>Incidents ouverts</h1>
        <ul className={styles.listeIncidents}>
          {incidentsOuverts(incidentsExemple).map((incident) => (
            <li key={incident.id}>
              <div className={styles.incidentEntete}>
                <strong>{incident.terrain}</strong>
                <span>{libelleStatut(incident.statut)}</span>
              </div>
              <div>{incident.equipement} — {incident.description}</div>
              <div>{libelleGravite(incident.gravite)}</div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
