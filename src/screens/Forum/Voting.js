import { useState } from "react";

const Voting = (initialValue, initialVoteStatus) => {
    const [score, setScore] = useState(initialValue);
    const [voteStatus, setVoteStatus] = useState(initialVoteStatus);
    
    const handleUpvote = () => {
        if (voteStatus === 'up') {
          // undo upvote
          setScore(score - 1);
          setVoteStatus(null);
        } 
        else if (voteStatus === 'down') {
            // change downvote to upvote
            setScore(score + 2);
            setVoteStatus('up');
        } else {
            // upvote
            setScore(score + 1);
            setVoteStatus('up');
        }
    };
  
    const handleDownvote = () => {
        if (voteStatus === 'down') {
            // undo downvote
            setScore(score + 1);
            setVoteStatus(null);
        } 
        else if (voteStatus === 'up') {
            // change upvote to downvote
            setScore(score - 2); // subtract 2 instead of 1
            setVoteStatus('down');
        } else {
            // downvote
            if (score === 0) {
                // do nothing
                return;
            }
            setScore(score - 1);
            setVoteStatus('down');
          }
        // check if user cancels their downvote after previously upvoting
        if (voteStatus === 'up' && score === 1) { 
            // If previous vote status was up and the score is 1
            // then set the score to 0
            setScore(0);
            setVoteStatus(null);
          }
    };
    
    return [score, voteStatus, handleUpvote, handleDownvote];
};

export default Voting;