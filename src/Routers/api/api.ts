// import express from expresss lib
import express, { Application, Request, Response } from 'express'
// Import path from path lib
import path from 'path'
// import file System from fs-ex lib
import fileSys from 'fs-extra'
//Import names from file /util
import names from '../util/util'
import imageprocessing  from '../app/sharp'
// create instance of that class Application  and make new express object
const app: Application = express()

// Create index  Router
app.get('/', (req: Request, res: Response) => {
  //---------------------------- making query string------------------------------------------
  const Fname = req.query.filename as string,
    w = req.query.width as string,
    h = req.query.height as string
  //--------------------------------end Queries------------------------------------------------

  //----------------------{{ Passing thec Query-pic/path (pic/folder)/coverison ti num of picture }}----------------------------
  const PathImg = path.join( process.cwd(),`img/${Fname}.jpg`)
  const requiredQueryNames = names.includes(Fname) as boolean // we can make new function that accepted heystack,needdle to find what are we looking inside array
  // converting height and width
  const width: number = parseInt(w),
  height: number = parseInt(h) 
  const pathToFolder = './img/resized',
  OutputSourceFolder:string = path.join(process.cwd(),`img/resized/${Fname}_${width}_${height}.jpg`) // 1: giving path for creating folder  and 2: then give the path of imag that we will resize it

  //------------------------------------------------------{{ end passing }}------------------------------------------------

  //-------------------------{{ Objects with errors , Handling errors With if/Switch Case }}-------------------------------
  const errors: { err1: string; err2: string; err3: string; warr: string } = {
    err1: ` <h5 style='  padding: 20px;background-color: #f44336;color: white;margin-bottom: 15px; text-align:center'> Bad request  404  Error in  ! Queries-string : are  not defined! </h5> `,
    err2: ` <h5 style=' padding: 20px;background-color: #f44336;color: white;margin-bottom: 15px; text-align:center '>Sorry ! filename and  height and width at least to be  10   length    ! </h5> `,
    err3: ` <h5 style=' padding: 20px;background-color: #f44336;color: white;margin-bottom: 15px; text-align:center '> this ${Fname} does not match  please provide the name as  well  ! </h5> `,
    warr: ` <h5 style=' padding: 20px;background-color: yellow;color: white;margin-bottom: 15px; text-align:center '>    error Query-width:${w} and Query-height:${h} is  not number  please check fro inputs as number</h5> `
  }
  // check if the query-name is not define
if (Fname == undefined) {
    return res.status(400).send(errors.err1)
  }
  // check if the Query-name is empty
 if((Fname&&h&&w).length==0) {
  // we can also add this condition fname.length > 1  it's vaild if there's at least one char
  return res.status(400).send(errors.err2)
  } 
  // valid hight and width
 if( isNaN(height && width) ) {

    return res.status(400).send(errors.warr)
  } 
 if(requiredQueryNames != true) {
    return res.status(400).send(errors.err3)
  }
  //-----------------------------------------------{ { End Handling errors With if/Switch Case } }-----------------------------------------------

  //----------------------------------------{ { if there's no error found Check from the width/height/name  } }-------------------------------

  // create a folder inside image Dir with Promise
      fileSys
        .ensureDir(pathToFolder)
        .then(() => {
          // return succufully message
         return 'this folder  has been created from pervious '
        })
        .catch((err) => {
          // catch  error if there's no parms
          return err
        })

        if (fileSys.existsSync(OutputSourceFolder)) { 
           return res.sendFile(OutputSourceFolder)
          } 

          imageprocessing(PathImg,width,height,OutputSourceFolder);   
 
          return  setTimeout(() => {
            try {
              fileSys.accessSync(OutputSourceFolder);
              res.status(200).sendFile(OutputSourceFolder);  
            } catch (err) {
              return err;
            }
          }, 10000);

      });

export default app


