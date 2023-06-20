export class Task {

    id : number;
    text : string;
    finished : boolean;
   
    // static completedTasksCounter : number = 0;


    constructor(text : string, id : number, finished? : boolean){
        this.text = text;
        this.id = id;

        if(finished){
            this.finished = finished
        } else {
            this.finished = false;
        }
    }

    // public toggleFinishedUnfinished(completedTasksCounter : number) {
    //     this.finished = !this.finished
    //     this.updateCompletedTasksCounter(completedTasksCounter);
    // }

    // private updateCompletedTasksCounter(completedTasksCounter : number) {
    //     if (this.finished) {
    //         completedTasksCounter++;
    //     } else {
    //         completedTasksCounter--;
    //     }
    // }
}