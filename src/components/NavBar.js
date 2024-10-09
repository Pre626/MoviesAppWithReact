import React, { useState } from "react";
import axios from "axios";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
} from "react-bootstrap";
import "./Style/NavBar.css";

const NavBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const apiKey = "c45a857c193f6302f2b5061c3b85e743";

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      onSearch([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${searchTerm}&page=1`
      );
      onSearch(response.data.results);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      onSearch([]);
    }
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="/" className="navbar-logo">
          MovieDb
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar-links">
            <Nav.Link href="/">Popular</Nav.Link>
            <Nav.Link href="/top-rated">Top Rated</Nav.Link>
            <Nav.Link href="/upcoming">Upcoming</Nav.Link>
          </Nav>
          <Form
            className="d-flex navbar-search"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <FormControl
              type="search"
              placeholder="Movie Name"
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value === "") {
                  onSearch([]);
                }
              }}
            />
            <Button
              variant="outline-light"
              onClick={handleSearch}
              className="search-button"
            >
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
