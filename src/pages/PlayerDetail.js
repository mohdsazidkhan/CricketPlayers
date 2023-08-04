import { Button, Card, Col, Layout, Row } from "antd";
import getPlayers from "../get-players";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import moment from "moment";
function PlayerDetail() {
  const navigate = useNavigate();
  let { playerID } = useParams();

  const [playerDetail, setPlayerDetail] = useState([]);
  const [similarPlayers, setSimilarPlayers] = useState([]);

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    if(playerID !== undefined){
      await getPlayers().then((result) => {
        let newdata = result.filter((item) => item.id === playerID);
        setPlayerDetail(newdata);
        let simdata = result.filter((item) => item.type === newdata[0]?.type && item.id !== playerID);
        setSimilarPlayers(simdata.slice(0, 5));
      });
    }
  };

  const openPage = async(id) =>{
    if(id !== undefined){
      navigate(`/player-detail/${id}`, { replace: true })
      await getPlayers().then((result) => {
        let newdata = result.filter((item) => item.id === id);
        setPlayerDetail(newdata);
        let simdata = result.filter((item) => item.type === newdata[0]?.type && item.id !== id);
        setSimilarPlayers(simdata.slice(0, 5));
      });
    }
  }

  console.log(playerDetail);

  var dob = playerDetail[0]?.dob;
  var now = Date.now();
  var age = moment.duration(now - dob).years();

  return (
    <div className="container mx-auto mt-5">
      <div className="flex justify-between mb-2 mx-4 md:mx-0">
        <h2 className="mb-4 text-2xl md:text-3xl">Player Detail</h2>
        <Button type="primary">
          <Link to="/">Back to Cricketers</Link>
        </Button>
      </div>
      <Card
        className="mx-4 md:mx-0"
        title={<div className="uppercase">{playerDetail[0]?.name}</div>}
        bordered={false}
      >
        <p>
          Rank: <strong>{playerDetail[0]?.rank}</strong>
        </p>
        <p>
          Type:{" "}
          <strong className="capitalize">
            {playerDetail[0]?.type ? playerDetail[0]?.type : "NA"}
          </strong>
        </p>
        <p>
          Points: <strong>{playerDetail[0]?.points}</strong>
        </p>
        <p>
          DOB:{" "}
          <strong>{moment(playerDetail[0]?.dob).format("DD MMM YYYY")}</strong>
        </p>
        <p>
          Age: <strong>{age} Years</strong>
        </p>
        <p className="mt-2">{playerDetail[0]?.description}</p>
      </Card>
      <hr/>
      <Layout className="mt-8 mb-8 mx-4 md:mx-0">
      <h2 className="mb-4 text-xl md:text-2xl">Similar Players</h2>
      {similarPlayers?.length > 0 ?
      <Row className="grid gap-4  gird-col-1 md:grid-cols-5">
        {similarPlayers?.map((player) => {
          return (
            <Col key={player?.id}>
              <Card
                title={<div onClick={()=>openPage(player?.id)} className="uppercase cursor-pointer">{player?.name}</div>}
                bordered={false}
              >
                
                <p>
                  Points: <strong>{player?.points}</strong>
                </p>
                <p>
                  Rank: <strong>{player?.rank}</strong>
                </p>
              </Card>
            </Col>
          );
        })}
      </Row>
      :
      <div>Data Not Found</div>
      }
    </Layout>

    </div>
  );
}

export default PlayerDetail;
