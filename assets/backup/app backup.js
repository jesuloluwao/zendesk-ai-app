var client = ZAFClient.init();
var customFieldKey = 'ticket.customField:custom_field_21830302707985';

client.on('app.registered', function() {
  client.invoke('resize', { width: '100%', height: '500px' });
  fetchAiSummary(); // Perform the initial fetch of the summary
});


function fetchAiSummary() {
    client.get(customFieldKey).then(function(data) {
      var aiSummary = data[customFieldKey];
      var aiSummaryElement = document.getElementById('ai-summary');
      var emptySummaryCard = document.getElementById('empty-summary-card');
  
      // If there is no summary, show the 'empty-summary-card' and hide the 'ai-summary' element.
      if (!aiSummary || aiSummary.trim() === '') {
        if (emptySummaryCard) emptySummaryCard.style.display = 'block';
        if (aiSummaryElement) aiSummaryElement.style.display = 'none';
      } else {
        // If there is a summary, display it and hide the 'empty-summary-card'.
        if (aiSummaryElement) {
          aiSummaryElement.style.display = 'block';
          aiSummaryElement.innerHTML = aiSummary;
        }
        if (emptySummaryCard) emptySummaryCard.style.display = 'none';
      }
    });
  }
  
  

function addSummaryTag() {
    client.invoke('ticket.tags.add', ['get-ai-summary']).then(function() {
      console.log('Tag added successfully');
      showAlert(); // This will show the alert
    }).catch(function(error) {
      console.error('Error adding tag:', error);
    });
  }
  

  function showToast() {
    var toast = document.getElementById('summary-toast');
    if (toast) {
      toast.present();
    } else {
      console.error('Toast element not found');
    }
  }
    
  function showAlert() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Summary';
    alert.message = "Save this ticket to see the new AI summary. Click 'Submit as...' below.";
    alert.buttons = ['OK'];
  
    document.body.appendChild(alert);
    return alert.present();
  }
  

function showModal() {
  var overlayModal = document.querySelector('ion-modal');
  if (overlayModal) {
    overlayModal.present();
  }
}

function closeModal() {
  var overlayModal = document.querySelector('ion-modal');
  if (overlayModal) {
    overlayModal.dismiss();
  }
}

function triggerZapierFlow() {
    client.get('ticket.id').then(function (data) {
      const ticketId = data['ticket.id'];
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/15220032/3w8sprq/';
  
      axios
        .post(zapierWebhookUrl, { ticketId: ticketId }, {
          headers: {
            'Content-Type': 'application/json',
            // Add any other headers your Zapier webhook needs
          }
        })
        .then(function (response) {
          console.log('Zapier flow triggered successfully', response);
        })
        .catch(function (error) {
          console.error('Error triggering Zapier flow', error);
        });
    });
  }
  
  

document.addEventListener('DOMContentLoaded', function() {
  var getSummaryButton = document.querySelector('ion-button#get-summary-btn');
  if (getSummaryButton) {
    getSummaryButton.addEventListener('click', addSummaryTag);
  } else {
    console.error('Get Summary button not found');
  }
});

document.addEventListener('DOMContentLoaded', function() {
    var getZapSummaryButton = document.querySelector('ion-button#zap-summary-btn');
    if (getZapSummaryButton) {
      getZapSummaryButton.addEventListener('click', triggerZapierFlow);
    } else {
      console.error('Get Summary button not found');
    }
  });


// Listen for changes to the custom field and update the summary live
client.on('ticket.custom_field_21830302707985.changed', fetchAiSummary);
