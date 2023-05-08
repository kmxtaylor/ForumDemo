import { useState } from "react";

// Notes on Voting:
// If the user has already upvoted, then clicking the upvote button again will undo the upvote.
// If the user has already downvoted, then clicking the downvote button again will undo the downvote.
// This implementation for Voting does not allow the vote score to be negative.
// Instead, if the vote score is 0 and the user clicks the downvote button, nothing happens (the lowest vote score is 0).

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