import { LightningElement } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import Font_Awesome from '@salesforce/resourceUrl/fontawesome';
export default class MemoryGame extends LightningElement {
isLibLoaded;
openedCards=[];
matchedCards =[];
moves = 0;
totalTime="00:00";
timeRef;
showCongratulations=false;
    cards =[
        {id:1,listClass:"card",type:"Diamond",icon:"fa fa-diamond"},
        {id:2,listClass:"card",type:"Car",icon:"fa fa-car"},
        {id:3,listClass:"card",type:"Money",icon:"fa fa-money"},
        {id:4,listClass:"card",type:"Lemon",icon:"fa fa-lemon-o"},
        {id:5,listClass:"card",type:"Diamond",icon:"fa fa-diamond"},
        {id:6,listClass:"card",type:"Cubes",icon:"fa fa-cubes"},
        {id:7,listClass:"card",type:"Flask",icon:"fa fa-flask"},
        {id:8,listClass:"card",type:"GamePad",icon:"fa fa-gamepad"},
        {id:9,listClass:"card",type:"Flask",icon:"fa fa-flask"},
        {id:10,listClass:"card",type:"Car",icon:"fa fa-car"},
        {id:11,listClass:"card",type:"GamePad",icon:"fa fa-gamepad"},
        {id:12,listClass:"card",type:"Money",icon:"fa fa-money"},
        {id:13,listClass:"card",type:"Bulb",icon:"fa fa-lightbulb-o"},
        {id:14,listClass:"card",type:"Cubes",icon:"fa fa-cubes"},
        {id:15,listClass:"card",type:"Bulb",icon:"fa fa-lightbulb-o"},
        {id:16,listClass:"card",type:"Lemon",icon:"fa fa-lemon-o"}
    ];

   get  gameRating(){
    let stars = this.moves<12 ? [1,2,3]:this.moves<=20 ? [1,2] : [1];
    return this.matchedCards.length===16?stars:[];
   }

    renderedCallback(){
        if(this.isLibLoaded){
            return 
        }else{
            loadStyle(this,Font_Awesome+'/fontawesome/css/font-awesome.min.css').then(()=>{
                console.log('fontAwesome imported Successfully');
            }).catch((error)=>{
                console.error(error);
            })
            this.isLibLoaded=true;
        }
        
    }

    displayCard(event){
        let currCard = event.target;
        currCard.classList.add("open","show","disabled");
        this.openedCards = this.openedCards.concat(event.target);
        let len = this.openedCards.length;
        if(len===2){
        this.moves = this.moves+1;
        if(this.moves===1){
            this.timer();
        }

        if(this.openedCards[0].type === this.openedCards[1].type){
          this.matchedCards = this.matchedCards.concat(this.openedCards[0],this.openedCards[1]);
          this.matched();
        }else{
            this.unmatched();
        }
        }
    }

    matched(){
        this.openedCards[0].classList.remove("show","open");
        this.openedCards[1].classList.remove("show","open");
        this.openedCards[0].classList.add("match");
        this.openedCards[1].classList.add("match");
        this.openedCards=[];
        if(this.matchedCards.length===16){
            this.showCongratulations = true;
            window.clearInterval(this.timeRef);
        }
    }
    unmatched(){
        this.openedCards[0].classList.add("unmatch");
        this.openedCards[1].classList.add("unmatch");
        this.action('DISABLE');
        setTimeout(()=>{
        this.openedCards[0].classList.remove("show","open","unmatch");
        this.openedCards[1].classList.remove("show","open","unmatch");
        this.openedCards=[];
        this.action('ENABLE');
        },1000)
    }

    action(action){
        let cards = this.template.querySelectorAll('.card');
        Array.from(cards).forEach((item)=>{
            if(action==='ENABLE'){
                let isMatch = item.classList.contains('match');
                if(!isMatch){
                    item.classList.remove('disabled');
                }
            }
            if(action === 'DISABLE'){
                item.classList.add('disabled');
            }
        })
    }
    suffleresetHandler(){
        this.showCongratulations = false;
        this.openedCards=[];
        this.matchedCards=[];
        this.moves=0;
        this.totalTime="00:00";
        window.clearInterval(this.timeRef);
        let elems = this.template.querySelectorAll('.card');
        Array.from(elems).forEach((item)=>{
            item.classList.remove("show","open","disabled","match");
        })

        // Logic for Shuffle 

        let array = [...this.cards];
        let counter= array.length;
        while(counter>0){
            let index = Math.floor(Math.random()*counter);
            counter--;
            
            let temp = array[counter];
            array[counter]= array[index];
            array[index]= temp;
        }
        this.cards= [...array];
    }


    timer(){
        let startTime = new Date();
       this.timeRef = setInterval(()=>{
            let diff = new Date().getTime()-startTime.getTime();
            let d = Math.floor(diff/1000)
            const m = Math.floor(d % 3600 / 60);
            const s = Math.floor(d % 3600 % 60);
            const mDisplay = m>0 ? m+(m===1?'minute':'minutes'):"";
            const sDisplay = s>0 ?s+(s===1?'second':'seconds'):"";
           this.totalTime = mDisplay+sDisplay;
        },1000);
    }
}