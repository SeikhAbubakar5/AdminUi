import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import Usertable from "./Usertable";
import Searchuser from "./Searchuser";
import { CircularProgress } from "@mui/material";

const Content = () => {
  const [user, setUser] = useState([]);
  const [debounce, setDebounce] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentPage, setRecentPage] = useState(1);
  const [allSelect, setallSelect] = useState(false);
  const [checkbox, setCheckbox] = useState([]);
  const totalPage = 10;

  const fetchAPIs = () => {
    setIsLoading(true);
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((response) => {
        setUser(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error occurred while fetching users:", error);
      });
  };

  useEffect(() => {
    fetchAPIs();
  }, []);

  const pages = Math.ceil(user.length / totalPage);
  const indexStart = (recentPage - 1) * totalPage;
  const indexEnd = indexStart + totalPage;
  const rowDisplayed = user.slice(indexStart, indexEnd);

  function previous() {
    setRecentPage(function (prevPage) {
      return prevPage - 1;
    });
  }

  function first() {
    setRecentPage(1);
  }

  function last() {
    setRecentPage(pages);
  }

  function next() {
    setRecentPage(function (prevPage) {
      return prevPage + 1;
    });
  }

  function goToPage(page) {
    setRecentPage(page);
  }

  const displayButton = () => {
    const buttons = [];
    for (let page = 1; page <= pages; page++) {
      buttons.push(
        <button
          key={page}
          onClick={() => goToPage(page)}
          disabled={recentPage === page}
        >
          {page}
        </button>
      );
    }
    return buttons;
  };

  const searchDebounce = (handleEvent, timeOut) => {
    setIsLoading(true);
    if (debounce) {
      clearTimeout(debounce);
    }
    const debounceCall = setTimeout(() => {
      const searchResult = user.filter((items) => {
        console.log(items.name.toLowerCase());
        return (
          items.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          items.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          items.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      if (handleEvent.target.value === "") {
        setUser(fetchAPIs());
      }
      setUser(searchResult);
    }, timeOut);
    setDebounce(debounceCall);
    setIsLoading(false);
  };

  const search = (e) => {
    setSearchTerm(e.target.value);
    searchDebounce(e, 500);
  };

  const userSelect = (userId) => {
    let userData;
    if (checkbox.includes(userId)) {
      userData = checkbox.filter((e) => {
        return e !== userId;
      });
    } else {
      userData = [...checkbox, userId];
    }

    setCheckbox(userData);
  };
  const selectAll = () => {
    if (checkbox.length !== 10) {
      setallSelect(true);
      const newCheckbox = [];
      for (let i = 0; i < rowDisplayed.length; i++) {
        newCheckbox.push(rowDisplayed[i].id);
      }
      setCheckbox(newCheckbox);
    } else {
      setallSelect(false);
      setCheckbox([]);
    }
    setIsLoading(false);
  };
  const userDelete = (userId) => {
    setIsLoading(true);
    setUser((e) => e.filter((user) => user.id !== userId));
    setIsLoading(false);
  };

  const deleteMultiple = () => {
    setIsLoading(true);
    setallSelect(false);

    checkbox.forEach((item) => {
      userDelete(item);
    });
  };
  //rendering JSX
  return (
    <div className="tablePosition">
      <Searchuser userSearch={search} />
      <Box>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allSelect}
                  onChange={selectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ display: "flex", gap: "0.5vw" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5">
                  <Box position={"absolute"} top={"30vh"}>
                    <CircularProgress />
                  </Box>
                </td>
              </tr>
            ) : (
              rowDisplayed.map((val) => {
                return (
                  <Usertable
                    user={val}
                    key={val.id}
                    checked={checkbox.includes(val.id)}
                    selectUser={() => userSelect(val.id)}
                    deleteUser={() => userDelete(val.id)}
                  />
                );
              })
            )}
          </tbody>
        </table>
        <div className="deleteButton">
          <button type="button" onClick={deleteMultiple}>
            DeleteAll
          </button>
        </div>
        <div className="pageButton">
          <div className="button-group">
            <button onClick={first} disabled={recentPage === 1}>
              {"<<"}
            </button>
            <button onClick={previous} disabled={recentPage === 1}>
              {"<"}
            </button>
            {displayButton()}
            <button onClick={next} disabled={recentPage === pages}>
              {">"}
            </button>
            <button onClick={last} disabled={recentPage === pages}>
              {">>"}
            </button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Content;
