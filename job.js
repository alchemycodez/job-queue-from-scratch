// try to write a func that pushes something into array

// this func work is to send the job from here to array

let arr1 = []
function enqueue(task, to, attempts) {
    const jobObj = {
        task: task,
        to: to,
        attempts: attempts
    }
    arr1.push(jobObj)
    return jobObj;
}

enqueue("sendEmail", "x@y.com", 0)
enqueue("sendApplication", "a@b.com", 0)
enqueue("resizeImage", "y@z.com", 0)
console.log("before:",arr1)


// write a worker fun, how it will get teh job out of the array and see what teh job it have to do 

// worker job is to: 1. call the task function
function worker(job) {
    // get the job, do its job
    // jobQueue = job
    if(!job) {
        return
    } else if(job.task == "sendEmail") {
        console.log("sending email:", job.task)
        // 1. call the task function
        try {
            sendEmail(job)
        } catch(error) {
            if(job.attempts + 1 >= 2) {
                console.log("giving up on job:", job)
                enqueueFailedJobs(job.task, job.to, job.attempts + 1)
                console.log(failedJobs)
            } else {
            enqueue(job.task, job.to, job.attempts + 1) 
            }
        }
    

    } else if(job.task == "sendApplication") {
        console.log("send application:", job.task)
    } else if(job.task == "resizeImage") {
        console.log("resize img:", job.task)
    } 

    setTimeout(() => {
        worker(arr1.shift())
        console.log("after:",arr1)
    }, 3000)
    
}


//FIFO => first in first out
worker(arr1.shift())


// function that do actual job
function sendEmail(job) {
    const flip = Math.floor(Math.random() * 2)

    if(flip === 0) {
        console.log("email sent")
    } else {
        throw new Error("email failed")
    }
   
}

let failedJobs = []

function enqueueFailedJobs(task, to, attempts) {
    const failedJobsObj = {
        task: task,
        to: to,
        attempts: attempts
    }
    failedJobs.push(failedJobsObj)
    return failedJobsObj;
}
