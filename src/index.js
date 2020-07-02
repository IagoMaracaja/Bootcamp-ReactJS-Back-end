const express = require('express');
const { uuid, isUuid } = require ('uuidv4');

const app = express();
app.use(express.json());

const projects = [];


/**
 * Middleware
 */

 function logRequest(request, response, next){
   const {method, url} = request;

   const logLabel = `[${method.toUpperCase()}] ${url}`;

   console.time(logLabel);

   next();

   console.timeEnd(logLabel);
 }

 function validateProjectId(request, response, next) {
    const {id} = request.params;

    if(!isUuid(id)){
      return response.status(400).json({error:'Invalid Project ID.'});
    }

    return next();
 }

 app.use(logRequest);
 app.use('/projects/:id', validateProjectId);

/**
 * HTTP GET
 */
app.get('/projects', (request, response)=>{
  const {title} = request.query;

  const results = title 
    ? projects.filter(proj => proj.title.includes(title))
    : projects;

  return response.json(results);
});

/**
 * HTTP POST
 */
app.post('/projects', (request, response)=>{
  const {title, owner} = request.body;
  console.log(title);
  console.log(owner);

  const project = {id: uuid(), title, owner};
  projects.push(project);
  return response.json(project);
});

/**
 * HTTP PUT
 */
app.put('/projects/:id', (request, response)=>{
  const {id} = request.params;
  const {title, owner} = request.body;

  const projectIndex = projects.findIndex(proj => proj.id == id);

  if (projectIndex < 0 ){
    return response.status(404).json({error: 'project not found.'});
  }

  const projAux = {
    id, title, owner
  }

  projects[projectIndex] = projAux;

  return response.json(projAux);
});

/**
 * HTTP DELETE
 */
app.delete('/projects/:id', (request, response)=>{
  const {id} = request.params;

  const projectIndex = projects.findIndex(proj => proj.id == id);

  if (projectIndex < 0 ){
    return response.status(404).json({error: 'project not found.'});
  }
  
  projects.splice(projectIndex, 1);

  return response.status(204).send();

});

app.listen(3333, () => {
  console.log('The server is running...');
});