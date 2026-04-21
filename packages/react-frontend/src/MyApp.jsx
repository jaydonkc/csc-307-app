import React, { useEffect, useState } from "react";
import Form from "./Form";
import Table from "./Table";

const API_URL = "http://localhost:8000";

function handleJsonResponse(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

function fetchUsers() {
  return fetch(`${API_URL}/users`).then(handleJsonResponse);
}

function postUser(person) {
  return fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  }).then((response) => {
    if (response.status !== 201) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  });
}

function deleteUser(id) {
  return fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
  }).then((response) => {
    if (response.status !== 204) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  });
}

function MyApp() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((json) => setCharacters(json.users_list))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function removeOneCharacter(id) {
    deleteUser(id)
      .then(() => {
        setCharacters((currentCharacters) => {
          return currentCharacters.filter((character) => character.id !== id);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) {
    return postUser(person)
      .then((createdUser) => {
        setCharacters((currentCharacters) => {
          return [...currentCharacters, createdUser];
        });

        return createdUser;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
