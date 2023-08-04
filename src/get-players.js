import data from './players';

const getPlayers = () => {
    return Promise.resolve(
        data
            .sort((a, b) => {
                const aPoints = a.points ?? 0;
                const bPoints = b.points ?? 0;

                return aPoints === bPoints
                    ? 0
                    : bPoints > aPoints
                        ? 1
                        : -1;
            })
            .map((it, index) => ({
                ...it,
                rank: index + 1
            }))
    );
};

export default getPlayers;
