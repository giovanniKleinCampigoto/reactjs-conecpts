import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [title, setTitle] = useState("");
  const [techs, setTechs] = useState([]);
  const [url, setUrl] = useState("");

  useEffect(() => {
    getRepos();
  }, []);

  async function getRepos() {
    const repos = await api.get("repositories");
    setRepositories(repos.data);
  }

  async function handleAddRepository() {
    const repository = {
      title,
      techs,
      url,
    };

    const { data } = await api.post("/repositories", repository);

    setRepositories([...repositories, data]);
    setTitle("");
    setTechs([]);
    setUrl("");
  }

  async function handleRemoveRepository(repoIndex) {
    const repo = repositories[repoIndex];

    await api.delete(`repositories/${repo.id}`);

    const newRepoArray = [...repositories];
    newRepoArray.splice(repoIndex, 1);

    setRepositories(newRepoArray);
  }

  const repoComponent = (repo, index) => {
    return (
      <li>
        {repo.title}
        <span>{repo.url}</span>
        <div className='techs-wrapper'>{techsComponent(repo.techs, false)}</div>
        <button className='remove-repository' onClick={() => handleRemoveRepository(index)}>
          Remover
        </button>
      </li>
    );
  };

  const techsComponent = (paramTechs, hasRemove) => {
    return paramTechs.map((tech, index) => (
      <span key={`${tech}_${index}`} class='tech'>
        {tech}
        {hasRemove && <span onClick={() => handleRemoveTech(index)}>X</span>}
      </span>
    ));
  };

  function handleTechsChange(evt) {
    setTechs([...techs, evt.target.value]);
  }

  function handleRemoveTech(techIndex) {
    const newTechs = [...techs];

    newTechs.splice(techIndex, 1);

    setTechs(newTechs);
  }

  return (
    <div>
      <ul className='repository-list' data-testid='repository-list'>
        {repositories.map((repo, index) => repoComponent(repo, index))}
      </ul>

      <div className='input-group'>
        <label>Title</label>
        <input value={title} onChange={(evt) => setTitle(evt.target.value)} />
        <label>Techs</label>
        <select value={techs[0]} onChange={handleTechsChange}>
          <option value='React'>React</option>
          <option value='React Native'>React Native</option>
          <option value='Vue'>Vue</option>
          <option value='Flutter'>Flutter</option>
        </select>
        {techsComponent(techs, true)}

        <label>Url</label>
        <input value={url} onChange={(evt) => setUrl(evt.target.value)} />
      </div>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
