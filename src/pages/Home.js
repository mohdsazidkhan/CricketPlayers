import { Card, Col, Layout, Row, Spin, Select, Input } from "antd";
import getPlayers from "../get-players";
import { useEffect, useState } from "react";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Search } = Input;
const itemsPerPage = 10;

function Home() {

  const [players, setPlayers] = useState([]);
  const [filteredData, setFilteredData] = useState(players);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [sortText, setSortText] = useState("");
  const [filterText, setFilterText] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = players.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getUsers = async () => {
    await getPlayers().then((result) => {
      setPlayers(result);
    });
  };

  const getFilteredPlayers = (players, searchSText, sortSText, filterSText) => {
    if(players?.length > 0){

      if(searchSText !== "" || sortSText !== "" || filterSText !== ""){

        let filteredplayers = players.filter((item) => {
          if (item?.name?.toLowerCase().includes(searchSText?.toLowerCase())) {
            return true;
          } else {
            return false;
          }
        });

        if (sortSText === "name") {
          filteredplayers = [...filteredplayers].sort((a, b) => {
            const nameA = a.name.toLowerCase(); 
            const nameB = b.name.toLowerCase();
            return nameA.localeCompare(nameB);
          });
        } else if (sortSText === "age") {
          filteredplayers = [...filteredplayers].sort(function (a, b) {
            var adob = a?.dob,
              bdob = b?.dob;
            var now = Date.now();
            var aage = moment.duration(now - adob).years();
            var bage = moment.duration(now - bdob).years();
            return aage - bage;
          });
        } else if (sortSText === "rank") {
          filteredplayers = [...filteredplayers].sort(function (a, b) {
            return b.rank - a.rank;
          });
          
        }
  
        filteredplayers = filteredplayers.filter((item) => {
          if(item?.type === filterSText){
            return true
          }else{
            return false
          }
        })

        setFilteredData(filteredplayers);

      }
      else{
        setPlayers(players)
      }
    }
  }

  useEffect(() => {
    getUsers();

    const searchSText = localStorage.getItem('searchText');
    const sortSText = localStorage.getItem('sortText');
    const filterSText = localStorage.getItem('filterText');

    setSearchText(searchSText);
    setSortText(sortSText);
    setFilterText(filterSText);

    (async () => {
      await getPlayers().then((result) => {
        getFilteredPlayers(result, searchSText, sortText, filterSText)
      });
    })();
  }, []);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  const handleSort = (value) => {
    localStorage.setItem('sortText', value);
    if(value !== "")
    {
      setSortText(value)
      if (value === "name") {
        const sortplayers = [...players].sort((a, b) => {
          const nameA = a.name.toLowerCase(); 
          const nameB = b.name.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        setPlayers(sortplayers)
      } else if (value === "age") {
        const ageplayes = [...players].sort(function (a, b) {
          var adob = a?.dob,
            bdob = b?.dob;
          var now = Date.now();
          var aage = moment.duration(now - adob).years();
          var bage = moment.duration(now - bdob).years();
          return aage - bage;
        });
        setPlayers(ageplayes);
      } else if (value === "rank") {
        const rankplayers = [...players].sort(function (a, b) {
          return b.rank - a.rank;
        });
        setPlayers(rankplayers);
      } 
    }else{
      getUsers();
      setSortText("")
    }
    
  };

  const handleFilter = async(value) => {
    setFilterText(value);
    localStorage.setItem('filterText', value);
    if(value === " "){
      getUsers()
    }else{
      await getPlayers().then((result) => {
        setPlayers(result);
      });
      const filterplayers = players.filter((item) => {
        if(item?.type === value){
          return true
        }else{
          return false
        }
      })
      setFilteredData(filterplayers);
    }
  };

  const handleOnSearch = (value) => {
    setSearchText(value)
    localStorage.setItem('searchText', value);
    let searchPlayes = players.filter((item) => {
      if (item?.name?.toLowerCase().includes(value?.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    });
    setPlayers(searchPlayes);
  };

  const handleSearchEnter = (e) => {
    let value = e.target.value;
    setSearchText(value)
    localStorage.setItem('searchText', value);
    let searchPlayes = players.filter((item) => {
      if (item?.name?.toLowerCase().includes(value?.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    });
    setPlayers(searchPlayes);
  };

  const handleSearchChange = (e) => {
    let value = e.target.value;
    setSearchText(value)
    if (value.trim().length > 0) {
      let searchPlayes = players.filter((item) => {
        if (item?.name?.toLowerCase().includes(value?.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      });
      setPlayers(searchPlayes);
    } else {
      getUsers();
    }
  };

  const handleBlurSearch = (e) => {
    let value = e.target.value;
    if (value.trim().length > 0) {
      setSearchText(value)
      localStorage.setItem('searchText', value);
      let searchPlayes = players.filter((item) => {
        if (item?.name?.toLowerCase().includes(value?.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      });
      setPlayers(searchPlayes);
    } else {
      getUsers();
    }
  }

  return (
    <div className="container mx-auto mt-5">
      <div className="flex flex-col md:flex-row justify-center md:justify-end mb-4 p-4 md:p-0">
        <Search
          placeholder="Search by name"
          allowClear={true}
          onSearch={handleOnSearch}
          onBlur={handleBlurSearch}
          onPressEnter={handleSearchEnter}
          onChange={handleSearchChange}
          value={searchText}
          style={{
            width: 250,
          }}
        />
        <div className="mb-2 me-4 ms-0 md:ms-4 mt-4 md:mt-0">
          <label>Sort: </label>
          <Select
            defaultValue=""
            style={{
              width: 120,
            }}
            value={sortText}
            onChange={handleSort}
            options={[
              {
                value: "",
                label: "Select",
              },
              {
                value: "name",
                label: "Name",
              },
              {
                value: "rank",
                label: "Rank",
              },
              {
                value: "age",
                label: "Age",
              },
            ]}
          />
        </div>
        <div className="mb-2">
          <label>Filter: </label>
          <Select
            defaultValue=""
            style={{
              width: 120,
            }}
            value={filterText}
            onChange={handleFilter}
            options={[
              {
                value: "",
                label: "Select",
              },
              {
                value: "bowler",
                label: "Bowler",
              },
              {
                value: "allRounder",
                label: "AllRounder",
              },
              {
                value: "batsman",
                label: "Batsman",
              },
              {
                value: "wicketKeeper",
                label: "WicketKeeper",
              },
            ]}
          />
        </div>
      </div>
      {filteredData?.length > 0 ?
      <Layout className="mx-4 md:mx-0">
      <Row className="grid gap-4 grid-col-1 md:grid-cols-4">
        {filteredData?.map((player) => {
          var dob = player?.dob;
          var now = Date.now();
          var age = moment.duration(now - dob).years();
          return (
            <Col key={player?.id}>
              <Card
                title={<Link to={`/player-detail/${player?.id}`} className="uppercase cursor-pointer">{player?.name}</Link>}
                bordered={false}
              >
                <p>
                  Rank: <strong>{player?.rank}</strong>
                </p>
                <p>
                  Type:{" "}
                  <strong className="capitalize">
                    {player?.type ? player?.type : "NA"}
                  </strong>
                </p>
                <p>
                  Points: <strong>{player?.points}</strong>
                </p>
                <p>
                  Age: <strong>{age} Years</strong>
                </p>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Layout>

      :
    
      currentItems?.length > 0 ? (
        <>
          <Layout className="mx-4 md:mx-0">
            <Row className="grid gap-4 gird-col-1 md:grid-cols-4">
              {currentItems?.map((player) => {
                var dob = player?.dob;
                var now = Date.now();
                var age = moment.duration(now - dob).years();
                return (
                  <Col key={player?.id}>
                    <Card
                      title={<Link to={`/player-detail/${player?.id}`} className="uppercase cursor-pointer">{player?.name}</Link>}
                      bordered={false}
                    >
                      <p>
                        Rank: <strong>{player?.rank}</strong>
                      </p>
                      <p>
                        Type:{" "}
                        <strong className="capitalize">
                          {player?.type ? player?.type : "NA"}
                        </strong>
                      </p>
                      <p>
                        Points: <strong>{player?.points}</strong>
                      </p>
                      <p>
                        Age: <strong>{age} Years</strong>
                      </p>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Layout>
          {/* Pagination controls */}
            <ul className="flex justify-end mt-4 mb-8 pagination">
              {Array.from({ length: Math.ceil(players.length / itemsPerPage) }, (_, index) => (
                <li className={`px-2 mx-2 cursor-pointer shadow ${index+1 === currentPage ? "active" : ""}`} key={index} onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </li>
              ))}
            </ul>
        </>
      ) : (
        <div className="flex justify-center">
          <Spin indicator={antIcon} />
        </div>
      )}
    
    </div>
  );
}

export default Home;
