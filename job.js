// function to enqueue job object into array

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


// worker function that calls the particular tasks function which does the job

async function worker(job) {
    // first check if job exist in queue or not
    if(!job) {
        return
    } else if(job.task == "sendEmail") {
        console.log("sending email:", job.task)
        // 1. call the email function
        try {
            const result = await sendEmail(job)
            console.log("result:", result)
        } catch(error) {
            if(job.attempts + 1 >= 2) {
                enqueueFailedJobs(job.task, job.to, job.attempts + 1)
                console.log("retry limit reached for job:", job)
                console.log("failed job arr:", failedJobs)
            } else {
            enqueue(job.task, job.to, job.attempts + 1) 
            }
        }

    } else if(job.task == "sendApplication") {
        console.log("sending application:", job.task)
        // 2. call sendApplication function
        try {
            const result = await sendApplication(job)
            console.log("result:", result)
        } catch (error) {
            if(job.attempts + 1 >= 2) {
                enqueueFailedJobs(job.task, job.to, job.attempts + 1)
                console.log("retry limit reached for job:", job)
                console.log("failed job arr:", failedJobs)
            } else {
                enqueue(job.task, job.to, job.attempts + 1)
            }
        }

    } else if(job.task == "resizeImage") {
        console.log("sending resize img:", job.task)
        //3. call resize function
        try {
            const result = await resizeImage(job)
            console.log("result:", result)
        } catch (error) {
            if(job.attempts + 1 >= 2) {
                enqueueFailedJobs(job.task, job.to, job.attempts + 1)
                console.log("retry limit reached for job:", job)
                console.log("failed job arr:", failedJobs)
            } else {
                enqueue(job.task, job.to, job.attempts + 1)
            }
        }
    } 

    setTimeout(() => {
        worker(arr1.shift())
        console.log("after:",arr1)
    }, 3000)
    
}


//FIFO => first in first out
worker(arr1.shift())
worker(arr1.shift())

// STEP-3 two workers both doing stuff at once is the whole point of concurrency"
// CONCURRENCY: multiple tasks are in progress at overlapping times but on single cpu core, they're actually taking turns, rapidly switching back and forth, so it looks like simultaneous from outside, under the hood , its one thing happening at a time, just not finishing one taks fully before starting the next.
// PARALLELISM: multiple tasks are literally executing at the exact same instant, this needs multiple cpu cores(or multiple processes/threads truly running side by side)


// function that do actual job
function sendEmail(job) {
    return new Promise((resolve, reject) => {
        const flip = Math.floor(Math.random() * 2)
        setTimeout(() => {
            if(flip === 0) {
                resolve("email sent")
            } else {
                reject(new Error ("email failed to send"))
            }
        }, 1000)
    })
}

// function to send application
function sendApplication(job) {
    return new Promise((resolve, reject) => {
        const flip = Math.floor(Math.random() * 2)
        setTimeout(() => {
            if(flip === 0) {
                resolve("Application sent")
            } else {
                reject(new Error ("Application failed to send"))
            }
        }, 1000)
    })
}

// function to resize image
function resizeImage(job) {
    return new Promise((resolve, reject) => {
        const flip = Math.floor(Math.random() * 2)
        setTimeout(() => {
            if(flip === 0) {
                resolve("Image resize done")
            } else {
                reject(new Error ("Failed to resize image"))
            }
        }, 1000)
    })
}

// failed jobs will queue in this array
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