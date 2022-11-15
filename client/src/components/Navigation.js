import { Button, Navbar, NavbarHeading, NavbarGroup, NavbarDivider, FileInput } from "@blueprintjs/core"
import React, { useCallback, useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"
import Loader from "./Loader"
import { useNavigate } from "react-router-dom";

const Navigation = () => {

  const navigate = useNavigate();
  const [userContext, setUserContext] = useContext(UserContext)

  const fetchUserDetails = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "/users/me", {
      method: "GET",
      credentials: "include",
      // Pass authentication token as bearer token in header
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async response => {
      if (response.ok) {
        const data = await response.json()
        setUserContext(oldValues => {
          return { ...oldValues, details: data }
        })
      } else {
        if (response.status === 401) {
          // Edge case: when the token has expired.
          // This could happen if the refreshToken calls have failed due to network error or
          // User has had the tab open from previous day and tries to click on the Fetch button
          window.location.reload()
        } else {
          setUserContext(oldValues => {
            return { ...oldValues, details: null }
          })
        }
      }
    })
  }, [setUserContext, userContext.token])

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details) {
      fetchUserDetails()
    }
  }, [userContext.details, fetchUserDetails])

//   const refetchHandler = () => {
//     // set details to undefined so that spinner will be displayed and
//     //  fetchUserDetails will be invoked from useEffect
//     setUserContext(oldValues => {
//       return { ...oldValues, details: undefined }
//     })
//   }

  const logoutHandler = () => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "/users/logout", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async response => {
      setUserContext(oldValues => {
        return { ...oldValues, details: undefined, token: null }
      })
      window.localStorage.setItem("logout", Date.now())
    })
  }

  const uploadHandler = event => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "/interfaces/upload", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userContext.token}`,
        },
        body: event.target.files[0]
      }).then(async response => {
        if (response.ok) {
          const data = await response.json()
          console.log(data)
        } else {
          console.log(response)
        }
      })
  }

  const projectHandler = () => {
    navigate("/projects");
  }


  const homeHandler = () => {
    navigate("/");
  }

  return userContext.details === null ? (
    "Error Loading User details"
  ) : !userContext.details ? (
    <Loader />
  ) : (
    <div style={{display: 'block', width: 500, padding: 30}}>
        <Navbar fixedToTop>
            <NavbarGroup align={'left'}>
                <NavbarHeading>NoScope</NavbarHeading>
                    <NavbarDivider />
                        <Button icon="home" text="Home" onClick={homeHandler} />
                        <Button icon="user" text="My Projects" onClick={projectHandler}/>
                    <NavbarDivider />
                        <FileInput text={'Select an OpenAPI v3 file'} buttonText={'Upload'} onChange={uploadHandler}/>
            </NavbarGroup>
            <NavbarGroup align={'right'}>
                <Button text="Logout" onClick={logoutHandler} minimal intent="primary"/>
            </NavbarGroup>
        </Navbar>
   </div>     
    
  )
}

export default Navigation