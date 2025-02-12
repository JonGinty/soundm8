import { Link } from "react-router-dom";
import { NavLink, NavLinkProps } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { MouseEvent as mouseEvent } from "react";

/// Mantine's NavLink doesn't play nice with react router so I wrote this wrapper
const SimpleNavLink = ({to, ...rest}: NavLinkArgs) => {

    const location = useLocation();
    const navigate = useNavigate();

    const doNavigate = (e: mouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        navigate(to);
    }

    return (
        <NavLink href={to} onClick={doNavigate} active={location.pathname === to} {...rest} />
    );
}

type NavLinkArgs = {
    to: string,
    label: string
} & NavLinkProps

export default SimpleNavLink;