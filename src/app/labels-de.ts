export const labelsDe = {
  portal: {
    header: {
      nav: {
        startPage: 'Startseite',
        psmEditor: 'PSM-Editor',
        tasks: 'Aufgaben',
        details: 'Details'
      },
      userProfile: {
        options: {
          logout: 'Logout'
        }
      }
    }
  },
  task: {
    overview: {
      title: 'Aufgaben',
      buttons: {
        newTask: 'Neue Aufgabe',
        actions: {
          main: 'Aktionen'
        }
      },
      criteria: {
        view: {
          label: 'Ansicht',
          all: 'alle Aufgaben',
          open: 'Zu Erledigen ',
          inProgress: 'In Arbeit',
          closed: 'Erledigt'
        }
      },
      results: {
        grid: {
          taskNumber: 'Aufgaben-Nr.',
          type: 'Aufgabentyp',
          createdAt: 'Erstellungsdatum',
          order: 'Auftrag',
          lastChangedAt: 'Letzte Änderung',
          status: 'Status',
        },
        tasks: 'Aufgabe(n)',
        sortedBy: 'Sortiert nach',
        noSorting: 'Keine Sortierung'
      }
    },
    details: {
      title: 'Aufgabendetails',
      buttons: {
        close: 'Abgeschlossene Aufgabe'
      },
      accordion: {
        details: 'Details',
        progress: 'Verlauf',
      },
      master: {
        title: 'Alle Aufgaben'
      },
      taskNumber: 'Aufgaben-Nr.',
      type: 'Aufgabentyp',
      createdAt: 'Erstellt',
      order: 'Auftrag',
      lastChangedAt: 'Zuletzt geändert',
      status: 'Status',
      assignedTo: 'Bearbeiter:in',
      description: 'Beschreibung',
      referenceType: 'Referenztyp',
      psmObjectId: 'PsmObjectId',
      Address: 'Adresse',
      coordinates: 'coordinates',
      gearSequence: 'Gangfolge',
      action_picker:{
        choose_action: 'Aktion wählen',
        apply: 'Anwenden',
        action: 'Aktion',
        types : {
          changeTaskStatus: 'Status ändern',
          follow_by: 'Wiedervorlage',
          Assign_to: 'Zuweisen an',
        },
        search: 'Suchen'
      },
      comment: {
        noCommentMessage_1:'Es wurden noch keine Kommentare für diese Aufgabe verfasst.',
        noCommentMessage_2:'Tippe @ ein, um jemanden in einem Kommentar zu markieren.',
        send: 'Senden',
        discard: 'Abbrechen',
        InProcessing: 'In Bearbeitung',
        apply: 'Anwenden',
        theTask: 'Die Aufgabe',
        wasCreated: 'wurde erstellt',
        commentEdited: 'Kommentar bearbeitet',
        processed: 'Bearbeitet',
        edit: 'Bearbeiten',
        delete: 'Löschen',
        commentDeleted: 'Kommentar gelöscht',
        enterComment: 'Kommentar eingeben',
      },
      unselectedTask: {
        title: 'Details',
        messageUnselected: 'Es ist keine Aufgabe ausgewählt.',
        toTask: 'Zu den Aufgaben',
        newTask: 'Aufgabe erstellen'
      }
    },
    common: {
      actions: {
        statusChangeInfoStartOne: 'Der Status von <b>{{taskNumber}}</b>',
        statusChangeInfoStartMany: 'Der Status von <b>{{numberOfTasks}} Aufgaben</b>',
        statusChangeInfoEnd: 'wurde auf <b>"{{taskStatus}}"</b> gesetzt.',
        statusChangeUndoInfoEnd: 'wurde zückgesetzt.',
        undo: 'Rückgängig'
      }
    },
    loading: 'Beladung'
  },
  shared:{
    enums:{
      taskStatus:{
        Closed: 'Erledigt',
        "In Progress": 'In Arbeit',
        Open: 'Zu Erledigen'
      }
    }
  }
}
