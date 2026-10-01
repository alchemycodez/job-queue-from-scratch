// try to write a func that pushes something into array

// this func work is to send the job from here to array

let arr1 = []
function enqueue(task, to) {
    const jobObj = {
        task: task,
        to: to
    }
    arr1.push(jobObj)
    return jobObj;
}

enqueue("sendEmail", "x@y.com")
enqueue("sendApplication", "a@b.com")
enqueue("resizeImage", "y@z.com")
console.log("before:",arr1)


// write a worker fun, how it will get teh job out of the array and see what teh job it have to do 

function worker(job) {
    // get the job, do its job
    // jobQueue = job
    if(!job) {
        return
    } else if(job.task == "sendEmail") {
        console.log("sending email:", job.task)
    } else if(job.task == "sendApplication") {
        console.log("send application:", job.task)
    } else if(job.task == "resizeImage") {
        console.log("resize img:", job.task)
    } 

    setTimeout(() => {
        worker(arr1.shift())
    }, 3000)
    
}


//FIFO => first in first out
worker(arr1.shift())

