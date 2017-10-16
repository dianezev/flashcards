import { Component, Input } from "@angular/core";
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Deck } from "../models/deck.model";
import { DeckService } from "../shared/deck.service";
import { UtilsService } from "../shared/utils.service";

@Component({
  selector: 'app-make-detail',
	templateUrl: './make-detail.component.html',
	styleUrls: ['./make-detail.component.css']  
})

export class MakeDetailComponent {
  @Input() deck: Deck;
	display = 'none';
	displayAddDeck = 'none';

  displayBar = "";
	displayHeart = "";
	isFavorite = false;
	favTitle = "";
	progressPct = 0;
	newCategory = "";
	newDeckName = "";

 	constructor(private deckService: DeckService,
 			        private utilsService: UtilsService,
			        private route: ActivatedRoute,
			        private router: Router) { }

	ngOnInit() {
		// Go get the progress bar img string
    if (this.deck) {
	  	this.progressPct = this.deck.progressBar;
		  this.isFavorite = this.deck.favorite;
		  this.favTitle = this.isFavorite ? "Click to remove 'FAVORITE' status" : "Click to mark this as a 'FAVORITE' deck";
    }
	}

	onAddDeck() {
  	// Show the add deck modal
    this.displayAddDeck = 'block';
	}

	private onAddNewDeck(answer:number) {
    // Get rid of the modal
		this.displayAddDeck = 'none';
		console.log('adding/cloning deck for: ' + this.newCategory + ' and ' + this.newDeckName);

		// Add a new deck
    if (answer === 1) {
			// TBD not working. Ask Lisa for help here - 
			// Should userId or something be passed into addDeck below?
			// As is, the value of 'this.deck' is undefined.
			// Not sure if an object with categ, deck name & userId should be passed in or what??
		
			console.log('about to call deckService.addDeck and passing in this.deck:')
			console.log(this.deck);

			this.deckService.addDeck(this.deck).subscribe(
        (deck: Deck) => {
          console.log(deck);
				// then either call onEdit() or something close to this router & require at least one card to be added?
				// or will deck list immed refresh to show new deck?
				// TBD think this will need same url as onEdit once that works...
				this.router.navigate(['./makeflashcards', 'edit', this.deck.deckId]);
			});
						
			// Clone a deck
		} else if (answer === 2) {
			// TBD check with lisa on what to incorp
			console.log('user wants to clone a deck');
		}

  }

	/// deck list look at import stuff - bring same vars over - clone drop, drop down etc.
//     private onModalResponse(answer:number) {
//         // This function fires when the user has made a selection on 
//         // the add card modal. 
//         // Possible answers:
//         // 0) Cancel and do nothing 
//         // 1) User wants to create his own deck, route to the edit screen
//         // 2) User would like to clone one of the existing decks

//         //Get rid of the modal
//         if (answer == 1) {
//             // they want to make their own, go to the make-add component
//             this.display = 'none';
//             this.router.navigate(['./makeflashcards/', 'add']);
//         } else if (answer == 2) {
//             // Go to deckservice and get list of possible decks to clone 
//             // to populate the dropdown list should look like
//             console.log(this.cloneDeckList);
//             console.log("Going to call getUnownedDecks");
//             this.cloneDeckList = [];
//             this.deckService.getUnownedDecks()
//                 .subscribe(
//                 (decks: Deck[]) => {
//                     console.log(decks);
//                     for (let deck of decks) {
//                         const deckName = deck.category+'-'+deck.name;
//                         this.cloneDeckList.push({id:deck.deckId, name:deckName});  
//                         }
//                     // Make the dropdown list show so the user can pick 
//                     // a deck to clone  
//                     this.cloneDrop = true;
//                 });

//             }

//     }

//     onClone() {
//         // This function fires when the user chooses a deck to clone
//         // this.cloneChoice is the id of the deck to clone
//         // Because of the subscription to deckschanged, the list will show
//         // the newly added cloned deck
//         this.display = 'none';
//         const deckToClone: Deck = this.deckService.getDeck(this.cloneChoice);
//         this.deckService.cloneDeck(deckToClone)
//             .subscribe(
//                 (deck: Deck) => {
//                    console.log(deck);
//                 });

//     }
 

////////////////////////////////////////////////////////////

	onDelete() {
  	// Show the delete modal
    this.display = 'block';
  }

  private onModalResponse(answer:boolean) {
    // Get rid of the modal
		this.display = 'none';
		console.log('onModalResponse just called');
		
    if (answer) {
      // Delete the deck
      this.deckService.deleteDeck(this.deck).subscribe(
        (deck: Deck) => {
          console.log(deck);
          // Navigate back to the list
          //this.router.navigate(['./makeflashcards/', 'makelist', this.deck.userId]);            
				});
		}
  }

	onEdit() {
		console.log(this.deck.deckId);
		this.router.navigate(['./makeflashcards', 'edit', this.deck.deckId]);
	}

	onFavorite() {
	    // Toggle favorite for this deck
	    this.deck.favorite = !this.deck.favorite;
	    this.deckService.updateDeck(this.deck).subscribe(
      		(deck: Deck) => {
        		console.log(deck);
					});
			this.isFavorite = this.deck.favorite;
			this.favTitle = this.isFavorite ? "Remove 'FAVORITE' status" : "Mark this deck as a 'FAVORITE'";			
	    // this.displayHeart = this.utilsService.heartPic(this.deck.favorite);
	}
}
