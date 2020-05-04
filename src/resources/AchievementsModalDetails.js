/* eslint-disable max-len */
export const AchievementsModalDetails = () => {
  return {
    title: "Your achievements",
    body: `<div>
        <div className="bgGreen100 brdRadius p-2">
          <div className="dis-f w-perc-100 a-c">
            <BrixelIcon iconSize="fsize-900" icon="cup-awards" color="green" />
            <div className="w-perc-100 ml-2">
              <p className="heading5 mb-1 dis-f jc-b">
                <span>Awards</span>
                <span className="ff-mono fweight-700">{done}/{done+toDo}</span>
              </p>
              <BrixelProgressBar
                classProgressBar={'pos-r'}
                rounded
                barBackground="Light"
                backgroundSaturation={200}
                progressValue={done * 100 / (done + toDo)}
                color="Green"
                saturation={400}
                classBackground="ov-h brdRadius"
                large={window.innerWidth >= 768}
                small={window.innerWidth < 768}
              />
            </div>
          </div>

          <p className="mt-3">Who does not like awards? To honor your effort and endurance we award you. Keep going to collect more and enjoy the ride.</p>

        </div>

        <div className="bgRed100 brdRadius p-2 mt-3">
          <div className="dis-f w-perc-100 a-c">
            <img className="w-fix-40" src={brixels} alt="icon awards" />
            <div className="w-perc-100 ml-2">
              <p className="heading5 dis-f jc-b a-c">
                <span>Brixels</span>
                <span className="ff-mono fweight-700">{brixelPoints.toLocaleString('de-CH')}</span>
              </p>
            </div>
          </div>

          <p className="mt-3"><span>This is our currency. You earn Brixels by completing tasks and getting awards.</span>

            <span className="txtRed700 fweight-500 dis-b mt-4">Coming soon: During your journey you can use Brixels to unlock addintional features and gifts.</span></p>

        </div>
      </div>`
  }
};
